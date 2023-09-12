import _ from "underscore";
import { prisma } from ".";
import { Gender, Picture, Preference, Prisma, User } from "@prisma/client";
import { randomWeightedClosestElo } from "@/helpers/rating";
import { BadRequestError } from "@/errors/BadRequestError";
import { isAdmin, isRegular } from "@/helpers/role";
import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";
import { base64ToString, toBase64 } from "@/helpers/crypto";
import { adjustDate, formatDate } from "@/helpers/date";
import { calculateAge } from "@shared/helpers/date";
import { StorageInteractor } from "@/types/storageInteractor";

const getRandomMatch = async (loggedUserId: string) => {
  const numPictures = await prisma.picture.count({
    where: {
      AND: [
        {
          userId: {
            not: loggedUserId,
          },
        },
        {
          user: {
            isBanned: false,
          },
        },
      ],
    },
  });

  if (numPictures < 2) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  const picture1 = await getRandomPicture(numPictures, loggedUserId);

  if (!picture1) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  const picture2 = await getRandomPicture(numPictures, loggedUserId, picture1.id);

  if (!picture2) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  return [picture1, picture2];
};

function getRandomPicture(numPictures: number, loggedUserId: string, opponentPicId?: string) {
  const extraValue = opponentPicId === undefined ? 0 : 1;
  const randomNumPic = _.random(numPictures - 1 - extraValue);

  const whereQuery: any = {
    AND: [
      {
        userId: {
          not: loggedUserId,
        },
      },
      {
        user: {
          isBanned: false,
        },
      },
    ],
  };

  if (opponentPicId) {
    whereQuery.AND.push({
      id: {
        not: opponentPicId,
      },
    });
  }

  return prisma.picture.findFirst({
    where: whereQuery,
    skip: randomNumPic,
    orderBy: {
      id: "asc",
    },
  });
}

const getMatchWithClosestEloStrategy = async (
  loggedUser: User,
  userPreferences: Preference | null
) => {
  const MAX_RETRIEVED_PICS = 100;
  let isMale = Math.random() > 0.5;

  const preferencesQuery: Prisma.UserWhereInput[] = [];

  if (userPreferences) {
    if (userPreferences.contentGender) {
      preferencesQuery.push({
        gender: userPreferences.contentGender,
      });
    }

    if (userPreferences.contentMaxAge) {
      preferencesQuery.push({
        dateOfBirth: {
          gt: formatDate(adjustDate(new Date(), { years: -userPreferences.contentMaxAge - 1 })),
        },
      });
    }

    preferencesQuery.push({
      dateOfBirth: {
        lt: formatDate(adjustDate(new Date(), { years: -userPreferences.contentMinAge, days: 1 })),
      },
    });
  }

  const preferencesVoterQuery: Prisma.PreferenceWhereInput[] = [];

  preferencesVoterQuery.push({
    OR: [
      {
        exposureGender: loggedUser.gender,
      },
      {
        exposureGender: null,
      },
    ],
  });

  if (loggedUser.dateOfBirth) {
    const loggedUserAge = calculateAge(loggedUser.dateOfBirth);

    preferencesVoterQuery.push({
      OR: [
        {
          exposureMaxAge: {
            gte: loggedUserAge,
          },
        },
        {
          exposureMaxAge: null,
        },
      ],
    });

    preferencesVoterQuery.push({
      OR: [
        {
          exposureMinAge: {
            lte: loggedUserAge,
          },
        },
      ],
    });
  }

  // Get picture with the least amount of votes. And in the preferences
  const genderArr = isMale ? [Gender.Male, Gender.Female] : [Gender.Female, Gender.Male];

  for (const genderVal of genderArr) {
    var picture1 = await prisma.picture.findFirst({
      where: {
        AND: [
          {
            user: {
              gender: genderVal,
            },
          },
          {
            userId: {
              not: loggedUser.id,
            },
          },
          {
            user: {
              isBanned: false,
            },
          },
          {
            user: {
              AND: preferencesQuery,
            },
          },
          {
            user: {
              OR: [
                {
                  preference: {
                    AND: preferencesVoterQuery,
                  },
                },
                {
                  preference: null,
                },
              ],
            },
          },
          {
            matches: {
              none: {
                vote: {
                  voterId: loggedUser.id,
                },
              },
            },
          },
          {
            reports: {
              none: {
                userReportingId: loggedUser.id,
              },
            },
          },
        ],
      },
      orderBy: {
        numVotes: "asc",
      },
      include: {
        user: true,
      },
    });

    if (picture1) {
      break;
    }
  }

  // @ts-ignore
  if (!picture1) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  let pictures = await getPicturesWithClosestElos(
    picture1,
    loggedUser,
    MAX_RETRIEVED_PICS,
    userPreferences,
    picture1.user.gender
  );

  if (pictures.length === 0) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  const selectedIdx = randomWeightedClosestElo(
    pictures.map((p) => p.rating),
    picture1.rating
  );

  const picture2 = pictures[selectedIdx];

  return [picture1, picture2];
};

function getPicturesWithClosestElos(
  opponentPicture: Picture,
  loggedUser: User,
  limit: number,
  userPreferences: Preference | null,
  gender: string | null
): Promise<(Picture & { abs_diff: number })[]> {
  const whereQuery: string[] = [];

  if (userPreferences) {
    if (userPreferences.contentGender) {
      whereQuery.push(`usr.gender = '${userPreferences.contentGender}'`);
    }

    if (userPreferences.contentMaxAge) {
      whereQuery.push(
        `usr."dateOfBirth" > '${formatDate(
          adjustDate(new Date(), { years: -userPreferences.contentMaxAge - 1 })
        )}'`
      );
    }

    whereQuery.push(
      `usr."dateOfBirth" < '${formatDate(
        adjustDate(new Date(), { years: -userPreferences.contentMinAge, days: 1 })
      )}'`
    );
  }

  if (!userPreferences?.contentGender && gender) {
    whereQuery.push(`usr.gender = '${gender}'`);
  }

  whereQuery.push(
    `(preference."exposureGender" = '${loggedUser.gender}' OR preference."exposureGender" IS NULL)`
  );

  if (loggedUser.dateOfBirth) {
    const loggedUserAge = calculateAge(loggedUser.dateOfBirth);

    whereQuery.push(
      `(preference."exposureMaxAge" >= ${loggedUserAge} OR preference."exposureMaxAge" IS NULL)`
    );

    whereQuery.push(
      `(preference."exposureMinAge" <= ${loggedUserAge} OR preference."exposureMinAge" IS NULL)`
    );
  }

  const where = whereQuery.length ? "AND " + whereQuery.join(" AND ") : "";

  return prisma.$queryRawUnsafe(`
      SELECT pic.*,
        ABS(${opponentPicture.rating.toFixed(2)}::numeric  - pic.rating) as abs_diff
      FROM "Picture" AS pic
      INNER JOIN "User" AS usr ON pic."userId" = usr.id
      LEFT JOIN "Preference" AS preference ON usr.id = preference."userId"
      WHERE pic."userId" != '${loggedUser.id}' AND pic.id != '${
    opponentPicture.id
  }' AND usr."isBanned" = FALSE ${where} AND
        NOT EXISTS (
          SELECT 1
          FROM "Report" AS report
          WHERE report."userReportingId" = '${loggedUser.id}' AND pic.id = report."pictureId"
        ) AND 
        NOT EXISTS (
          SELECT 1 FROM "_MatchToPicture" as ab
          INNER JOIN "Match" as match ON ab."A" = match.id
          INNER JOIN "Vote" as vote ON match.id = vote."matchId"
          WHERE ab."B" = pic.id AND vote."voterId" = '${loggedUser.id}'
        )
      ORDER BY abs_diff ASC
      LIMIT ${limit};`);
}

// TODO: Improve this function code
async function getPicturesWithPercentile(
  userId: string | undefined,
  loggedUser: User,
  hasReport: boolean | undefined,
  belongsToMe: boolean | undefined,
  isBanned: boolean | undefined,
  gender: string | undefined,
  minAge: number | undefined,
  maxAge: number | undefined,
  limit: number | undefined,
  cursor: string | undefined,
  orderByObj: Record<string, ORDER_BY_DIR_OPTIONS_TYPE>
): Promise<{ pictures: (Picture & { percentile: number })[]; nextCursor: string | undefined }> {
  const loggedUserId = loggedUser.id;
  const role = loggedUser.role;

  const whereQuery: (boolean | string)[] = [true];
  const havingQuery: string[] = [];
  const joinQuery: string[] = [];
  let groupByQuery = "";
  const orderByQuery: { orderByField: string; orderByDir: ORDER_BY_DIR_OPTIONS_TYPE }[] = [
    { orderByField: "pic_perc.percentile", orderByDir: "desc" },
    { orderByField: "pic.id", orderByDir: "asc" },
  ];

  const orderKey = Object.keys(orderByObj)[0];
  const orderValue = Object.values(orderByObj)[0];
  const extraSelectField = [];

  let orderType: "date" | "number" = "number";
  let useHaving = false;

  const PIC_GROUP_BY =
    (getAllColumnNames() ?? ["id"]).map((col) => `pic."${col}"`).join(", ") +
    ", pic_perc.percentile";

  const USER_JOIN = `
    INNER JOIN "User" as usr
    ON pic."userId" = usr.id`;

  // TODO: have inner and left join. Use inner instead of where not null (performance gain?)
  const REPORT_LEFT_JOIN = `
    LEFT JOIN "Report" as report
    ON pic.id = report."pictureId"`;

  const NO_BANNED_USERS_WHERE = `usr."isBanned" is FALSE`;
  let joinInnerQuery: string[] = [USER_JOIN];
  let whereInnerQuery: string[] = [`pic."numVotes" > 0`, NO_BANNED_USERS_WHERE];

  if (isRegular(role) || belongsToMe) {
    whereInnerQuery.push(`usr.gender = '${loggedUser.gender}'`);
  } else if (gender) {
    whereInnerQuery.push(`usr.gender = '${gender}'`);
  }

  // Filtering
  if (userId) {
    whereQuery.push(`pic."userId" = '${userId}'`);
  } else if (isRegular(role)) {
    whereQuery.push(`pic."userId" = '${loggedUserId}'`);
  }

  // Sorting
  if (["score", "numVotes", "createdAt"].includes(orderKey)) {
    if (orderKey === "score") {
      orderByQuery[0].orderByField = `pic_perc.percentile`;
    } else {
      orderByQuery[0].orderByField = `pic."${orderKey}"`;
    }
    orderByQuery[0].orderByDir = orderValue;
    if (orderKey === "createdAt") {
      orderType = "date";
    }
  }

  if (isAdmin(role)) {
    // Filtering
    whereQuery.push(`usr."isBanned" IS ${isBanned ? "TRUE" : "FALSE"}`);
    joinQuery.push(USER_JOIN);

    if (isBanned) {
      joinInnerQuery = joinInnerQuery.filter((q) => q != USER_JOIN);
      whereInnerQuery = whereInnerQuery.filter((q) => q != NO_BANNED_USERS_WHERE);
    }

    if (hasReport !== undefined) {
      whereQuery.push(`report.id IS ${hasReport ? "NOT NULL" : "NULL"}`);
      groupByQuery = `GROUP BY ${PIC_GROUP_BY}`;
      joinQuery.push(REPORT_LEFT_JOIN);
    }

    if (belongsToMe !== undefined) {
      whereQuery.push(`pic."userId" ${belongsToMe ? "=" : "!="} '${loggedUserId}'`);
    }

    if (gender) {
      whereQuery.push(`usr.gender = '${gender}'`);
    }

    if (minAge) {
      whereQuery.push(
        `usr."dateOfBirth" < '${formatDate(adjustDate(new Date(), { years: -minAge, days: 1 }))}'`
      );
    }

    if (maxAge) {
      whereQuery.push(
        `usr."dateOfBirth" > '${formatDate(adjustDate(new Date(), { years: -maxAge - 1 }))}'`
      );
    }

    // Sorting
    if (["reportedDate"].includes(orderKey)) {
      joinQuery.push(REPORT_LEFT_JOIN);
      whereQuery.push(`report.id IS NOT NULL`);
      groupByQuery = `GROUP BY ${PIC_GROUP_BY}`;
      orderByQuery[0].orderByField = `MAX(report."createdAt")`;
      orderByQuery[0].orderByDir = orderValue;
      orderType = "date";
      useHaving = true;
    }
  }

  // Limit
  let limitQuery = "";
  if (limit !== undefined) {
    limitQuery = `LIMIT ${limit + 1}`;
    if (orderType === "date") {
      extraSelectField.push(
        `to_char(${orderByQuery[0].orderByField}, 'YYYY-MM-DD HH24:MI:SS.MS') AS cursor`
      );
    } else {
      extraSelectField.push(`${orderByQuery[0].orderByField} AS cursor`);
    }
  }

  // cursor
  const decryptedCursor = cursor !== undefined ? base64ToString(cursor) : undefined;
  if (decryptedCursor !== undefined && decryptedCursor.split(",").length === 2) {
    const [cursorId, cursorMainField] = decryptedCursor.split(",");

    const firstOrderBy = orderByQuery[0];
    const sign = firstOrderBy.orderByDir === "asc" ? ">" : "<";

    let transformedMainField: any = cursorMainField;

    if (orderType === "date") {
      transformedMainField = `'${new Date(cursorMainField + "Z").toISOString()}'`;
    }

    if (transformedMainField === "null") {
      if (useHaving) {
        havingQuery.push(`${firstOrderBy.orderByField} IS NULL AND pic.id > '${cursorId}'`);
      } else {
        whereQuery.push(`${firstOrderBy.orderByField} IS NULL AND pic.id > '${cursorId}'`);
      }
    } else {
      if (useHaving) {
        havingQuery.push(
          `(${firstOrderBy.orderByField} ${sign} ${transformedMainField} OR (${firstOrderBy.orderByField} = ${transformedMainField} AND pic.id > '${cursorId}' ) OR ${firstOrderBy.orderByField} IS NULL)`
        );
      } else {
        whereQuery.push(
          `(${firstOrderBy.orderByField} ${sign} ${transformedMainField} OR (${firstOrderBy.orderByField} = ${transformedMainField} AND pic.id > '${cursorId}' ) OR ${firstOrderBy.orderByField} IS NULL)`
        );
      }
    }
  }

  orderByQuery[0].orderByDir += " NULLS LAST";
  const orderBy = orderByQuery.reduce((acc, el, index) => {
    return acc + `${index > 0 ? "," : ""} ${el.orderByField} ${el.orderByDir}`;
  }, "");

  const having = havingQuery.length > 0 ? `HAVING ${havingQuery.join(" AND ")}` : "";

  const pictures: (Picture & { percentile: number } & { cursor?: any })[] =
    await prisma.$queryRawUnsafe(`
      SELECT pic.*, pic_perc.percentile ${
        extraSelectField.length > 0 ? ", " + extraSelectField.join(", ") : ""
      }
      FROM "Picture" AS pic
      LEFT JOIN (
        SELECT 
          pic.id,
          100 * PERCENT_RANK() OVER (ORDER BY pic.rating) AS percentile
        FROM 
          "Picture" AS pic
        ${joinInnerQuery}
        WHERE 
          ${whereInnerQuery.join(" AND ")}
      ) AS pic_perc
        ON pic.id = pic_perc.id
      ${[...new Set(joinQuery)].join("\n")} 
      WHERE 
        ${whereQuery.join(" AND ")}
      ${groupByQuery}
      ${having}
      ORDER BY ${orderBy}
      ${limitQuery};`);

  const hasMore = limit !== undefined && pictures.length === limit + 1;

  const picturesWithoutLast = hasMore ? pictures.slice(0, -1) : pictures;

  let nextCursor: string | undefined;
  if (hasMore) {
    const lastPic = picturesWithoutLast[picturesWithoutLast.length - 1];

    if (lastPic.cursor !== undefined) {
      nextCursor = lastPic.id + "," + String(lastPic.cursor);
    }
  }

  const picturesWithoutCursor = picturesWithoutLast.map((pic) => _.omit(pic, "cursor"));

  return {
    pictures: picturesWithoutCursor,
    nextCursor: nextCursor ? toBase64(nextCursor) : undefined,
  };
}

function getAllColumnNames() {
  return Prisma.dmmf.datamodel.models
    .find((model) => model.name === "Picture")
    ?.fields.filter((f) => f.kind === "scalar")
    .map((f) => f.name);
}

function omitRatingParams(pic: Partial<Picture> & Record<string, any>) {
  return _.omit(pic, "rating", "ratingDeviation", "volatility");
}

function getReturnPic(
  pic: Partial<Picture> & Record<string, any>,
  storageInteractor: StorageInteractor
) {
  const { filepath, ...ommitedPic } = omitRatingParams(pic);
  const imgUrl = storageInteractor.getImageUrl(filepath);

  return { ...ommitedPic, url: imgUrl };
}

export const PictureModel = {
  ...prisma.picture,
  getRandomMatch,
  getMatchWithClosestEloStrategy,
  getPicturesWithPercentile,
  omitRatingParams,
  getReturnPic,
};
