import _ from "underscore";
import { prisma } from "..";
import { Picture, Prisma, User } from "@prisma/client";
import { isAdmin, isRegular } from "@/helpers/role";
import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";
import { base64ToString, toBase64 } from "@/helpers/crypto";
import { adjustDate, formatDate } from "@/helpers/date";
import { StorageInteractor } from "@/types/storageInteractor";
import { getMatchPictures } from "./match/matchQuery";
import { UNLIMITED_VOTE_ALL_ON } from "@shared/constants/purchase";

interface IReturnPicWithPervental {
  id: string;
  filepath: string;
  numVotes: number;
  percentile: number;
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
  orderByObj: Record<string, ORDER_BY_DIR_OPTIONS_TYPE>
): Promise<{ pictures: IReturnPicWithPervental[]; nextCursor: string | undefined }> {
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

  // Select
  const percentileSelect = isGlobal
    ? `100 * PERCENT_RANK() OVER (ORDER BY pic.rating)`
    : `
    CASE
      WHEN MIN(pic.rating) OVER () < 0 THEN 100 * (pic.rating - MIN(pic.rating) OVER ())/(MAX(pic.rating) OVER () - MIN(pic.rating) OVER ())
      ELSE 100 * pic.rating/MAX(pic.rating) OVER () 
    END`;

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
      joinInnerQuery = joinInnerQuery.filter((q) => ![USER_JOIN, PURCHASE_JOIN].includes(q));
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

  // Sub-Query Pic Percentile
  const whenLimitedVotes =
    isBanned || isAdmin(role) || !UNLIMITED_VOTE_ALL_ON
      ? `FALSE`
      : `(purchase."hasUnlimitedVotes" IS NULL OR purchase."hasUnlimitedVotes" = FALSE) AND 
        pic."hasPurchasedUnlimitedVotes" = FALSE`;

  const subQueryPicPercentile = `
    SELECT 
      pic.id,
      pic."numVotes",
      ${percentileSelect} AS percentile
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
        END AS "numVotes"
      FROM "Picture" AS pic
      ${joinInnerQuery.join("\n")}
      WHERE 
        ${whereInnerQuery.join(" AND ")}
    ) AS pic`;

  // Improve performance by only returning necessary fields
  const pictures: (IReturnPicWithPervental & {
    cursor?: any;
  })[] = await prisma.$queryRawUnsafe(`
      SELECT pic.id, pic.filepath, pic_perc."numVotes", pic_perc.percentile ${
        extraSelectField.length > 0 ? ", " + extraSelectField.join(", ") : ""
      }
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
  getMatchPictures,
  getPicturesWithPercentile,
  omitRatingParams,
  getReturnPic,
};
