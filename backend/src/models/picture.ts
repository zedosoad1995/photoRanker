import _ from "underscore";
import { prisma } from ".";
import { Picture, Prisma } from "@prisma/client";
import { randomWeightedClosestElo } from "@/helpers/rating";
import { BadRequestError } from "@/errors/BadRequestError";

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
  return prisma.$queryRaw(
    Prisma.sql`
      SELECT pic.*,
        ABS(${opponentPicture.elo.toFixed(2)}::numeric  - pic.elo) as abs_diff
      FROM "Picture" AS pic
      INNER JOIN "User" AS usr ON pic."userId" = usr.id
      WHERE pic."userId" != ${loggedUserId} AND pic.id != ${
      opponentPicture.id
    } AND usr."isBanned" IS false
      ORDER BY abs_diff ASC
      LIMIT ${limit};`
  );
}

export const PictureModel = {
  ...prisma.picture,
  getRandomMatch,
  getMatchWithClosestEloStrategy,
};
