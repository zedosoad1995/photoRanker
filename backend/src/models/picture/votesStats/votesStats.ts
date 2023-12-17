import { prisma } from "@/models";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { UserRole } from "@prisma/client";
import { Countries, Ethnicities, Genders } from "@shared/types/user";
import { generateUserStatsWhenAdmin } from "./generateAdminUserStats";
import { ILoggedUser } from "@/types/user";
import { UNLIMITED_STATS_ON } from "@shared/constants/purchase";
import { isRegular } from "@/helpers/role";
import { MAX_FREE_STATS_PER_PIC } from "@shared/constants/purchase";

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
  storageInteractor: StorageInteractor,
  loggedUser: ILoggedUser
) => {
  // regular && not purchased && flag_on -> order by asc, Limit 5
  const hasLimitedStats =
    UNLIMITED_STATS_ON && isRegular(loggedUser.role) && !loggedUser.purchase?.hasUnlimitedStats;

  let res: IGetPictureVotesStatsQueryReturn[] = await prisma.$queryRawUnsafe(`
    WITH
      CTE AS (
        SELECT
          m2p."A" AS id,
          v."voterId" AS voter_id,
          v."createdAt",
          v."matchId",
          CASE
            WHEN v."winnerPictureId" = '${pictureId}' THEN v."winnerVoterAge"
            ELSE v."loserVoterAge"
          END AS "voterAge",
          CASE
            WHEN v."winnerPictureId" = '${pictureId}' THEN v."winnerVoterGender"
            ELSE v."loserVoterGender"
          END AS "voterGender",
          CASE
            WHEN v."winnerPictureId" = '${pictureId}' THEN v."winnerVoterCountry"
            ELSE v."loserVoterCountry"
          END AS "voterCountry",
          CASE
            WHEN v."winnerPictureId" = '${pictureId}' THEN v."winnerVoterEthnicity"
            ELSE v."loserVoterEthnicity"
          END AS "voterEthnicity",
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
          INNER JOIN "User" as u ON u.id = pic."userId"
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
          AND u."isBanned" IS FALSE

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
      main."createdAt" ${hasLimitedStats ? "ASC" : "DESC"}`);

  const count = res.length;
  if (hasLimitedStats) {
    // The plus 1, is because we want to kinda display an extra stat, for visual purposes. We do not really care if the user can find the extra vote trhough the API
    res = res.slice(0, MAX_FREE_STATS_PER_PIC + 1);
  }

  return { stats: generateUserStatsWhenAdmin(res), count };
};
