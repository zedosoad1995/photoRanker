import {
  FAKE_AGE_DISTRIBUTION,
  FAKE_COUNTRY_DISTRIBUTION,
  FAKE_MAIN_ETHNICITY,
} from "@/constants/user";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { pickRandomKey } from "@/helpers/random";
import { isAdmin } from "@/helpers/role";
import { prisma } from "@/models";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { VoteModel } from "@/models/vote";
import { RatingRepo } from "@/types/repositories/ratingRepo";
import { Gender } from "@prisma/client";
import { Request, Response } from "express";
import { omit } from "underscore";

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

  let voterInfo: Partial<{
    voterCountry: string;
    voterEthnicity: string;
    voterAge: number;
    voterGender: Gender;
  }> = {};

  if (isAdmin(loggedUser.role)) {
    const country = pickRandomKey(FAKE_COUNTRY_DISTRIBUTION);
    //@ts-ignore
    const ethnicity = FAKE_MAIN_ETHNICITY[country];
    const age = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
    const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
    voterInfo = {
      voterCountry: country,
      voterEthnicity: ethnicity,
      voterAge: age,
      voterGender: gender,
    };
  }

  const createNewVote = VoteModel.create({
    data: {
      ...voterInfo,
      voterAge: 1,
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

  // When there was no vote skip
  if (winnerPicture) {
    const loserPicture = match.pictures.find((picture) => picture.id !== winnerPictureId)!;

    // Winner update
    const winnerRatingParams = ratingRepo.calculateNewRating(winnerPicture, loserPicture, true);

    if (winnerPicture.numVotes < winnerPicture.maxFreeVotes) {
      winnerRatingParams.freeRating = winnerRatingParams.rating;
    }

    const updateWinnerPictureScore = PictureModel.update({
      where: {
        id: winnerPictureId,
      },
      data: {
        numVotes: winnerPicture.numVotes + 1,
        ...winnerRatingParams,
      },
    });

    // Loser update
    const loserRatingParams = ratingRepo.calculateNewRating(loserPicture, winnerPicture, false);

    if (loserPicture.numVotes < loserPicture.maxFreeVotes) {
      loserRatingParams.freeRating = loserRatingParams.rating;
    }

    const updateLoserPictureScore = PictureModel.update({
      where: {
        id: loserPicture.id,
      },
      data: {
        numVotes: loserPicture.numVotes + 1,
        ...loserRatingParams,
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

  res
    .status(201)
    .send({ vote: omit(vote, "voterCountry", "voterEthnicity", "voterAge", "voterGender") });
};
