import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { VoteModel } from "@/models/vote";
import { RatingRepo } from "@/types/ratingRepo";
import { Request, Response } from "express";

export const vote = (ratingRepo: RatingRepo) => async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const matchId = req.body.matchId;
  const winnerPictureId = req.body.winnerPictureId;

  const match = await MatchModel.findUnique({
    where: {
      id: matchId,
    },
    include: {
      pictures: true,
      activeUser: true,
    },
  });

  if (!match) {
    throw new NotFoundError("Match does not exist");
  }

  if (match.activeUser?.id !== loggedUser.id) {
    throw new ForbiddenError("User cannot access this match");
  }

  if (winnerPictureId) {
    var winnerPicture = match.pictures.find((picture) => picture.id === winnerPictureId);
    if (!winnerPicture) {
      throw new NotFoundError("Voted picture does not exist, or does not belong to this match");
    }
  }

  const createNewVote = VoteModel.create({
    data: {
      match: {
        connect: {
          id: matchId,
        },
      },
      voter: {
        connect: {
          id: loggedUser.id,
        },
      },
      winnerPicture: winnerPictureId
        ? {
            connect: {
              id: winnerPictureId,
            },
          }
        : undefined,
    },
  });

  const makeMatchInactive = MatchModel.update({
    where: {
      id: matchId,
    },
    data: {
      activeUser: {
        disconnect: true,
      },
    },
  });

  if (winnerPicture) {
    const loserPicture = match.pictures.find((picture) => picture.id !== winnerPictureId)!;

    const updateWinnerPictureScore = PictureModel.update({
      where: {
        id: winnerPictureId,
      },
      data: {
        numVotes: winnerPicture.numVotes + 1,
        ...ratingRepo.calculateNewRating(winnerPicture, loserPicture, true),
      },
    });

    const updateLoserPictureScore = PictureModel.update({
      where: {
        id: loserPicture.id,
      },
      data: {
        numVotes: loserPicture.numVotes + 1,
        ...ratingRepo.calculateNewRating(loserPicture, winnerPicture, false),
      },
    });

    var [vote, _] = await prisma.$transaction([
      createNewVote,
      makeMatchInactive,
      updateWinnerPictureScore,
      updateLoserPictureScore,
    ]);
  } else {
    var [vote, _] = await prisma.$transaction([createNewVote, makeMatchInactive]);
  }

  res.status(201).send({ vote });
};
