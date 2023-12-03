import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { prisma } from "..";

export const getPictureVotesStats = async (
  pictureId: string,
  storageInteractor: StorageInteractor
) => {
  return prisma.$queryRawUnsafe(`
    WITH
      CTE AS (
        SELECT
          m2p."A" AS id
          v."voterId" AS voter_id,
          v."createdAt",
          v."matchId",
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
      u.name AS voter_name,
      u.gender AS voter_gender,
      u."countryOfOrigin" AS voter_country,
      u.ethnicity AS voter_ethnicity,
      EXTRACT(
        YEAR
        FROM
          age (current_date, u."dateOfBirth"::date)
      ) AS voter_age,
      main.is_winner,
      MAX(main.winner_pic) AS winner,
      MAX(main.loser_pic) AS loser,
      main."createdAt"
    FROM
      CTE AS main
      INNER JOIN "User" AS u ON main.voter_id = u.id
    GROUP BY
      main."matchId",
      main."createdAt",
      main.is_winner,
      u.id
    ORDER BY
      main."createdAt" DESC`);
};
