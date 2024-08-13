import _ from "underscore";
import { prisma } from "..";
import { Picture, Prisma, User } from "@prisma/client";
import { isAdmin, isRegular } from "@/helpers/role";
import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";
import { base64ToString, toBase64 } from "@/helpers/crypto";
import { adjustDate, formatDate } from "@/helpers/date";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { getMatchPictures } from "./match/matchQuery";
import { UNLIMITED_VOTE_ALL_ON, UNLIMITED_VOTE_MULTIPLE_ON } from "@shared/constants/purchase";
import { calculateAge } from "@shared/helpers/date";
import { IAgeGroup } from "@shared/types/picture";
import { getPictureVotesStats } from "./votesStats/votesStats";
import { RatingRepo } from "@/types/repositories/ratingRepo";

const getAgeQuery = (minAge: number, maxAge?: number) => {
  const query = `"dateOfBirth" < '${formatDate(
    adjustDate(new Date(), { years: -minAge, days: 1 }),
  )}'`;

  if (maxAge === undefined) {
    return query;
  }

  return `${query} AND 
    "dateOfBirth" > '${formatDate(adjustDate(new Date(), { years: -maxAge - 1 }))}'`;
};

const AGE_GROUPS = [
  {
    min: 18,
    max: 23,
    query: getAgeQuery(18, 23),
  },
  {
    min: 24,
    max: 29,
    query: getAgeQuery(24, 29),
  },
  {
    min: 30,
    max: 39,
    query: getAgeQuery(30, 39),
  },
  {
    min: 40,
    query: getAgeQuery(40),
  },
];

interface IReturnPicWithPervental {
  id: string;
  filepath: string;
  numVotes: number;
  percentile: number;
  isActive: boolean;
}

// TODO: Improve this function code
async function getPicturesWithPercentile(
  userId: string | undefined,
  loggedUser: User,
  hasReport: boolean | undefined,
  belongsToMe: boolean | undefined,
  isBanned: boolean | undefined,
  isGlobal: boolean | undefined,
  gender: string | undefined,
  minAge: number | undefined,
  maxAge: number | undefined,
  limit: number | undefined,
  cursor: string | undefined,
  orderByObj: Record<string, ORDER_BY_DIR_OPTIONS_TYPE>,
  ratingRepo: RatingRepo,
): Promise<{
  pictures: IReturnPicWithPervental[];
  nextCursor: string | undefined;
  ageGroup: IAgeGroup;
}> {
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
  const extraSelectField = [`pic_perc."ageGroupPercentile"`];

  let orderType: "date" | "number" = "number";
  let useHaving = false;

  const PIC_GROUP_BY =
    (getAllColumnNames() ?? ["id"]).map((col) => `pic."${col}"`).join(", ") +
    `, pic_perc.percentile, pic_perc."numVotes", pic_perc."cannotSeeAllVotes", pic_perc."ageGroupPercentile"`;

  const USER_JOIN = `
    INNER JOIN "User" as usr
      ON pic."userId" = usr.id`;

  const PURCHASE_JOIN = `
    LEFT JOIN "Purchase" as purchase
      ON purchase."userId" = usr.id`;

  // TODO: have inner and left join. Use inner instead of where not null (performance gain?)
  const REPORT_LEFT_JOIN = `
    LEFT JOIN "Report" as report
    ON pic.id = report."pictureId"`;

  const NO_BANNED_USERS_WHERE = `usr."isBanned" is FALSE`;
  let joinInnerQuery: string[] = [USER_JOIN, PURCHASE_JOIN];
  let whereInnerQuery: string[] = [`pic."numVotes" > 0`, NO_BANNED_USERS_WHERE];

  if (isRegular(role) || belongsToMe) {
    whereInnerQuery.push(`usr.gender = '${loggedUser.gender}'`);
  } else if (gender) {
    whereInnerQuery.push(`usr.gender = '${gender}'`);
  }

  if (!isGlobal) {
    whereInnerQuery.push(`usr.id = '${loggedUser.id}'`);
    whereInnerQuery.push(`pic."isGlobal" IS FALSE`);
  } else {
    whereInnerQuery.push(`pic."isGlobal" IS TRUE`);
  }

  // Filtering
  if (userId) {
    whereQuery.push(`pic."userId" = '${userId}'`);
  } else if (isRegular(role)) {
    whereQuery.push(`pic."userId" = '${loggedUserId}'`);
  }

  whereQuery.push(`"isGlobal" IS ${isGlobal ? "TRUE" : "FALSE"}`);

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
      joinInnerQuery = joinInnerQuery.filter((q) => ![PURCHASE_JOIN].includes(q));
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
        `usr."dateOfBirth" < '${formatDate(adjustDate(new Date(), { years: -minAge, days: 1 }))}'`,
      );
    }

    if (maxAge) {
      whereQuery.push(
        `usr."dateOfBirth" > '${formatDate(adjustDate(new Date(), { years: -maxAge - 1 }))}'`,
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
        `to_char(${orderByQuery[0].orderByField}, 'YYYY-MM-DD HH24:MI:SS.MS') AS cursor`,
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
          `(${firstOrderBy.orderByField} ${sign} ${transformedMainField} OR (${firstOrderBy.orderByField} = ${transformedMainField} AND pic.id > '${cursorId}' ) OR ${firstOrderBy.orderByField} IS NULL)`,
        );
      } else {
        whereQuery.push(
          `(${firstOrderBy.orderByField} ${sign} ${transformedMainField} OR (${firstOrderBy.orderByField} = ${transformedMainField} AND pic.id > '${cursorId}' ) OR ${firstOrderBy.orderByField} IS NULL)`,
        );
      }
    }
  }

  orderByQuery[0].orderByDir += " NULLS LAST";
  const orderBy = orderByQuery.reduce((acc, el, index) => {
    return acc + `${index > 0 ? "," : ""} ${el.orderByField} ${el.orderByDir}`;
  }, "");

  const having = havingQuery.length > 0 ? `HAVING ${havingQuery.join(" AND ")}` : "";

  // Sub-Query Pic Percentile
  const subQueryPicPercentileSelect = [];

  const percentileSelect = `${
    isGlobal
      ? `
      100 * CASE 
        WHEN COUNT(*) OVER() = 1 THEN 1
        ELSE PERCENT_RANK() OVER (ORDER BY pic.rating)
      END`
      : `pic.rating`
  } AS percentile`;

  subQueryPicPercentileSelect.push(percentileSelect);

  let ageGroup;

  if (isGlobal) {
    if (!loggedUser.dateOfBirth) {
      throw new Error("User does not have dateOfBirth");
    }

    const userAge = calculateAge(loggedUser.dateOfBirth);
    const _ageGroup = AGE_GROUPS.find(
      (row) => userAge >= row.min && (row.max === undefined || userAge <= row.max),
    );

    const ageGroupQuery = _ageGroup?.query;

    if (_ageGroup === undefined || ageGroupQuery === undefined) {
      throw new Error("No age group found");
    }

    ageGroup = { min: _ageGroup.min, max: _ageGroup.max };

    const percentileAgeGroupSelect = `
      100 * 
      CASE 
        WHEN COUNT(*) OVER(PARTITION BY CASE WHEN ${ageGroupQuery} THEN 1 ELSE 0 END) = 1 THEN 1
        ELSE PERCENT_RANK() OVER (
          PARTITION BY CASE WHEN ${ageGroupQuery} THEN 1 ELSE 0 END 
          ORDER BY pic.rating
        )
      END AS "ageGroupPercentile"`;

    subQueryPicPercentileSelect.push(percentileAgeGroupSelect);
  } else {
    subQueryPicPercentileSelect.push(`NULL AS "ageGroupPercentile"`);
  }

  const whenLimitedVotes =
    isBanned || isAdmin(role) || !(UNLIMITED_VOTE_ALL_ON || UNLIMITED_VOTE_MULTIPLE_ON)
      ? `FALSE`
      : `${
          UNLIMITED_VOTE_ALL_ON
            ? '(purchase."hasUnlimitedVotes" IS NULL OR purchase."hasUnlimitedVotes" = FALSE) AND'
            : ""
        } ${
          UNLIMITED_VOTE_MULTIPLE_ON ? 'pic."hasPurchasedUnlimitedVotes" = FALSE AND' : ""
        } pic."numVotes" > pic."maxFreeVotes"`;

  const subQueryPicPercentile = `
    SELECT 
      pic.id,
      pic."cannotSeeAllVotes",
      pic."numVotes",
      ${subQueryPicPercentileSelect.join(",\n")}
    FROM (
      SELECT 
        pic.id,
        pic."userId",
        pic."isGlobal",
        CASE
          WHEN ${whenLimitedVotes} THEN pic."freeRating"
          ELSE pic.rating
        END AS rating,
        CASE
          WHEN ${whenLimitedVotes} THEN pic."maxFreeVotes"
          ELSE pic."numVotes"
        END AS "numVotes",
        CASE
          WHEN ${whenLimitedVotes} THEN TRUE
          ELSE FALSE
        END AS "cannotSeeAllVotes",
        usr."dateOfBirth"
      FROM "Picture" AS pic
      ${joinInnerQuery.join("\n")}
      WHERE 
        ${whereInnerQuery.join(" AND ")}
    ) AS pic`;

  // Improve performance by only returning necessary fields
  const pictures: (IReturnPicWithPervental & {
    cursor?: any;
  })[] = await prisma.$queryRawUnsafe(`
      SELECT pic.id, pic."userId", pic.filepath, pic."isActive", pic."numVotes" AS "numPaidVotes", pic_perc.percentile,
      CASE
        WHEN pic_perc."numVotes" IS NULL THEN 0
        ELSE pic_perc."numVotes"
      END AS "numVotes",
      CASE
        WHEN pic_perc."cannotSeeAllVotes" IS NULL THEN FALSE
        ELSE pic_perc."cannotSeeAllVotes"
      END AS "cannotSeeAllVotes"
      ${extraSelectField.length > 0 ? ", " + extraSelectField.join(", ") : ""}
      FROM "Picture" AS pic
      LEFT JOIN (${subQueryPicPercentile}) AS pic_perc
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

  if (!isGlobal) {
    const picsWithVotes = picturesWithoutLast.filter((pic) => pic.numVotes > 0);

    if (picsWithVotes.length > 1) {
      const nonGlobalPics = await getUserNonGlobalPics(loggedUser);

      const newScores = Object.fromEntries(
        picsWithVotes
          .slice()
          .sort((a, b) => b.percentile - a.percentile)
          .map((pic, index, pics) => {
            const pic1 = nonGlobalPics[pic.id];
            const pic2 = nonGlobalPics[pics[index === 0 ? 1 : 0].id];
            return [pic.id, ratingRepo.getWinProbability(pic1, pic2)];
          }),
      );

      const sumScores = Object.entries(newScores).reduce((prev, [_, value]) => prev + value, 0);

      picturesWithoutLast.forEach(({ id }, index) => {
        picturesWithoutLast[index].percentile = (100 * newScores[id]) / sumScores;
      });
    }
  }

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
    ageGroup,
  };
}

async function getUserNonGlobalPics(loggedUser: User) {
  const nonGlobalPics = await prisma.picture.findMany({
    where: {
      userId: loggedUser.id,
      isGlobal: false,
    },
  });

  return Object.fromEntries(nonGlobalPics.map((pic) => [pic.id, pic]));
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
  storageInteractor: StorageInteractor,
) {
  const { filepath, ...ommitedPic } = omitRatingParams(pic);
  const imgUrl = storageInteractor.getImageUrl(filepath);

  return { ...ommitedPic, url: imgUrl };
}

function getUpdateFieldsToReturn(
  pic: Partial<Picture> & Record<string, any>,
  storageInteractor: StorageInteractor,
) {
  const { filepath, ...ommitedPic } = omitRatingParams(pic);
  const imgUrl = storageInteractor.getImageUrl(filepath);
  const retPic = _.omit(ommitedPic, "freeRating", "hasPurchasedUnlimitedVotes", "isGlobal");

  return { ...retPic, url: imgUrl };
}

export const PictureModel = {
  ...prisma.picture,
  getMatchPictures,
  getPicturesWithPercentile,
  omitRatingParams,
  getReturnPic,
  getUpdateFieldsToReturn,
  getPictureVotesStats,
};
