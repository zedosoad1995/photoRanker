import _ from "underscore";
import { prisma } from ".";
import { Picture, Prisma } from "@prisma/client";
import { randomWeightedClosestElo } from "@/helpers/rating";
import { BadRequestError } from "@/errors/BadRequestError";
import { isAdmin, isRegular } from "@/helpers/role";
import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";

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

const getMatchWithClosestEloStrategy = async (loggedUserId: string) => {
  const MAX_RETRIEVED_PICS = 100;

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

  // Get picture with the least amount of votes
  const picture1 = await prisma.picture.findFirst({
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
    orderBy: {
      numVotes: "asc",
    },
  });

  if (!picture1) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  let pictures = await getPicturesWithClosestElos(picture1, loggedUserId, MAX_RETRIEVED_PICS);
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
  loggedUserId: string,
  limit: number
): Promise<(Picture & { abs_diff: number })[]> {
  return prisma.$queryRaw(
    Prisma.sql`
      SELECT pic.*,
        ABS(${opponentPicture.rating.toFixed(2)}::numeric  - pic.rating) as abs_diff
      FROM "Picture" AS pic
      INNER JOIN "User" AS usr ON pic."userId" = usr.id
      WHERE pic."userId" != ${loggedUserId} AND pic.id != ${
      opponentPicture.id
    } AND usr."isBanned" = FALSE
      ORDER BY abs_diff ASC
      LIMIT ${limit};`
  );
}

// TODO: Improve this function code
function getPicturesWithPercentile(
  userId: string | undefined,
  loggedUserId: string,
  role: string,
  hasReport: boolean | undefined,
  belongsToMe: boolean | undefined,
  isBanned: boolean | undefined,
  orderByObj: Record<string, ORDER_BY_DIR_OPTIONS_TYPE>
): Promise<(Picture & { percentile: number })[]> {
  const whereQuery: (boolean | string)[] = [true];
  const joinQuery: string[] = [];
  let groupByQuery = "";
  let orderByField = "pic.rating";
  let orderByDir = "DESC";
  const orderKey = Object.keys(orderByObj)[0];
  const orderValue = Object.values(orderByObj)[0];

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

  // Filtering
  if (userId) {
    whereQuery.push(`pic."userId" = '${userId}'`);
  } else if (isRegular(role)) {
    whereQuery.push(`pic."userId" = '${loggedUserId}'`);
  }

  // Sorting
  if (["score", "numVotes", "createdAt"].includes(orderKey)) {
    if (orderKey === "score") {
      orderByField = `pic.rating`;
    } else {
      orderByField = `pic."${orderKey}"`;
    }
    orderByDir = orderValue;
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

    // Sorting
    if (["reportedDate"].includes(orderKey)) {
      joinQuery.push(REPORT_LEFT_JOIN);
      whereQuery.push(`report.id IS NOT NULL`);
      groupByQuery = `GROUP BY ${PIC_GROUP_BY}`;
      orderByField = `MAX(report."createdAt")`;
      orderByDir = orderValue;
    }
  }

  return prisma.$queryRawUnsafe(`
      SELECT pic.*, pic_perc.percentile
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
      ORDER BY ${orderByField} ${orderByDir};`);
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

export const PictureModel = {
  ...prisma.picture,
  getRandomMatch,
  getMatchWithClosestEloStrategy,
  getPicturesWithPercentile,
  omitRatingParams,
};
