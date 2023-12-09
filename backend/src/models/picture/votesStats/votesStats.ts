import { prisma } from "@/models";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { UserRole } from "@prisma/client";
import { Countries, Ethnicities, Genders } from "@shared/types/user";
import { generateUserStatsWhenAdmin } from "./generateAdminUserStats";

export interface IGetPictureVotesStatsQueryReturn {
  id: string;
  voter_gender: Genders | null;
  voter_country: Countries | null;
  voter_ethnicity: Ethnicities | null;
  voter_age: number;
  fake_gender: Genders | null;
  fake_country: Countries | null;
  fake_ethnicity: Ethnicities | null;
  fake_age: number | null;
  voter_role: UserRole;
  is_winner: boolean;
  winner: string | null;
  loser: string | null;
  createdAt: Date;
}

export const getPictureVotesStats = async (
  pictureId: string,
  storageInteractor: StorageInteractor
) => {
  const res: IGetPictureVotesStatsQueryReturn[] = await prisma.$queryRawUnsafe(`
    WITH
      CTE AS (
        SELECT
          m2p."A" AS id,
          v."voterId" AS voter_id,
          v."createdAt",
          v."matchId",
          v."voterAge",
          v."voterGender",
          v."voterCountry",
          v."voterEthnicity",
          CASE
            WHEN v."winnerPictureId" = pic.id THEN CONCAT(
              '${storageInteractor.getBaseDir()}',
              '/',
              REPLACE(pic.filepath, '%5C', '/')
            )
            ELSE NULL
          END AS winner_pic,
          CASE
            WHEN v."winnerPictureId" != pic.id THEN CONCAT(
              '${storageInteractor.getBaseDir()}',
              '/',
              REPLACE(pic.filepath, '%5C', '/')
            )
            ELSE NULL
          END AS loser_pic,
          CASE
            WHEN v."winnerPictureId" = '${pictureId}' THEN TRUE
            ELSE FALSE
          END AS is_winner
        FROM
          "Picture" AS pic
          INNER JOIN "_MatchToPicture" AS m2p ON m2p."B" = pic."id"
          INNER JOIN "Vote" AS v ON m2p."A" = v."matchId"
        WHERE
          m2p."A" IN (
            SELECT
              "A"
            FROM
              "_MatchToPicture"
            WHERE
              "B" = '${pictureId}'
          )
          AND v."winnerPictureId" IS NOT NULL
      )

    SELECT
      main.id,
      u.gender AS voter_gender,
      u."countryOfOrigin" AS voter_country,
      u.ethnicity AS voter_ethnicity,
      u.role AS voter_role,
      EXTRACT(
        YEAR
        FROM
          age (current_date, u."dateOfBirth"::date)
      ) AS voter_age,
      main.is_winner,
      MAX(main.winner_pic) AS winner,
      MAX(main.loser_pic) AS loser,
      main."createdAt",
      main."voterAge" AS fake_age,
      main."voterGender" AS fake_gender,
      main."voterCountry" AS fake_country,
      main."voterEthnicity" AS fake_ethnicity
    FROM
      CTE AS main
      INNER JOIN "User" AS u ON main.voter_id = u.id
    GROUP BY
      main."matchId",
      main."createdAt",
      main.is_winner,
      main."voterAge",
      main."voterGender",
      main."voterCountry",
      main."voterEthnicity",
      u.id,
      main.id
    HAVING MAX(main.winner_pic) IS NOT NULL AND MAX(main.loser_pic) IS NOT NULL
    ORDER BY
      main."createdAt" DESC`);

  return generateUserStatsWhenAdmin(res);
};
