import _ from "underscore";
import { prisma } from "../..";
import { Gender, Picture, Preference, User } from "@prisma/client";
import { randomWeightedClosestElo } from "@/helpers/rating";
import { BadRequestError } from "@/errors/BadRequestError";
import { isAdmin } from "@/helpers/role";
import { adjustDate, formatDate } from "@/helpers/date";
import { calculateAge } from "@shared/helpers/date";
import { getFirstPic } from "./getFirstPicture";

const getPicturesWithClosestElos = (
  opponentPicture: Picture,
  loggedUser: User,
  limit: number,
  userPreferences: Preference | null,
  gender: string | null,
  isGlobal: boolean
): Promise<(Picture & { abs_diff: number })[]> => {
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

  if (!loggedUser.canBypassPreferences) {
    whereQuery.push(
      `(preference."exposureGender" = '${loggedUser.gender}' OR preference."exposureGender" IS NULL)`
    );

    if (loggedUser.dateOfBirth) {
      const loggedUserAge = calculateAge(loggedUser.dateOfBirth);

      whereQuery.push(
        `(preference."exposureMaxAge" >= ${loggedUserAge} OR preference."exposureMaxAge" IS NULL)`
      );

      whereQuery.push(`(preference."exposureMinAge" <= ${loggedUserAge})`);
    }
  }

  if (!isAdmin(loggedUser.role)) {
    whereQuery.push(`NOT EXISTS (
      SELECT 1 FROM "_MatchToPicture" as ab
      INNER JOIN "Match" as match ON ab."A" = match.id
      INNER JOIN "Vote" as vote ON match.id = vote."matchId"
      WHERE ab."B" = pic.id AND vote."voterId" = '${loggedUser.id}'
    )`);
  }

  whereQuery.push(`pic."isGlobal" = ${isGlobal ? "TRUE" : "FALSE"}`);

  if (!isGlobal) {
    whereQuery.push(`pic."userId" = '${opponentPicture.userId}'`);
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
        )
      ORDER BY abs_diff ASC
      LIMIT ${limit};`);
};

export const getMatchPictures = async (loggedUser: User, userPreferences: Preference | null) => {
  const MAX_RETRIEVED_PICS = 100;
  let isMale = Math.random() > 0.5;
  const gender = isMale ? Gender.Male : Gender.Female;

  const picture1 = await getFirstPic(gender, loggedUser, userPreferences);

  if (!picture1) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  let pictures = await getPicturesWithClosestElos(
    picture1,
    loggedUser,
    MAX_RETRIEVED_PICS,
    userPreferences,
    picture1.gender,
    picture1.isGlobal
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
