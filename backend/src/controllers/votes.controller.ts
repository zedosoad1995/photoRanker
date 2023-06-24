import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { VoteModel } from "@/models/vote";
import { Request, Response } from "express";

export const vote = async (req: Request, res: Response) => {
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

  const winnerPicture = match.pictures.find(
    (picture) => picture.id === winnerPictureId
  );
  if (!winnerPicture) {
    throw new NotFoundError(
      "Voted picture does not exist, or does not belong to this match"
    );
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
      winnerPicture: {
        connect: {
          id: winnerPictureId,
        },
      },
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

  const updateWinnerPictureScore = PictureModel.update({
    where: {
      id: winnerPictureId,
    },
    data: {
      numVotes: winnerPicture.numVotes + 1,
    },
  });

  const [vote, ...other] = await prisma.$transaction([
    createNewVote,
    makeMatchInactive,
    updateWinnerPictureScore,
  ]);

  res.status(201).send({ vote });
};
