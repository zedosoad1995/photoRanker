import _ from "underscore";
import { prisma } from ".";
import { Picture, Prisma } from "@prisma/client";
import { randomWeightedClosestElo } from "@/helpers/rating";
import { BadRequestError } from "@/errors/BadRequestError";

const getRandomMatch = async (loggedUserId: string) => {
  const numPictures = await prisma.picture.count({
    where: {
      userId: {
        not: loggedUserId,
      },
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
  const MAX_ELO_DIFF = 200;

  const numPictures = await prisma.picture.count({
    where: {
      userId: {
        not: loggedUserId,
      },
    },
  });

  if (numPictures < 2) {
    throw new BadRequestError("Not enought pictures for the match");
  }

  // Get picture with the least amount of votes
  const picture1 = await prisma.picture.findFirst({
    where: {
      userId: {
        not: loggedUserId,
      },
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
    pictures.map((p) => p.elo),
    picture1.elo
  );

  const picture2 = pictures[selectedIdx];

  return [picture1, picture2];
};

function getPicturesWithClosestElos(
  opponentPicture: Picture,
  loggedUserId: string,
  limit: number
): Promise<(Picture & { abs_diff: number })[]> {
  console.log(
    `
    SELECT *,
      ABS(${opponentPicture.elo.toFixed(2)}::numeric - elo) as abs_diff
    FROM "Picture"
    WHERE "userId" != ${loggedUserId} AND id != ${opponentPicture.id}
    ORDER BY abs_diff ASC
    LIMIT ${limit};
  `,
    Prisma.sql`
      SELECT *,
        ABS(${opponentPicture.elo.toFixed(2)}::numeric  - elo) as abs_diff
      FROM "Picture"
      WHERE "userId" != ${loggedUserId} AND id != ${opponentPicture.id}
      ORDER BY abs_diff ASC
      LIMIT ${limit};`
  );

  return prisma.$queryRaw(
    Prisma.sql`
      SELECT *,
        ABS(${opponentPicture.elo.toFixed(2)}::numeric  - elo) as abs_diff
      FROM "Picture"
      WHERE "userId" != ${loggedUserId} AND id != ${opponentPicture.id}
      ORDER BY abs_diff ASC
      LIMIT ${limit};`
  );
}

export const PictureModel = {
  ...prisma.picture,
  getRandomMatch,
  getMatchWithClosestEloStrategy,
};
