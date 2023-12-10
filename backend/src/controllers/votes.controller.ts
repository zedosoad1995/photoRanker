import {
  FAKE_AGE_DISTRIBUTION,
  FAKE_COUNTRY_DISTRIBUTION,
  FAKE_MAIN_ETHNICITY,
  FAKE_OTHER_RACE_PROB,
} from "@/constants/user";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { pickRandomKey } from "@/helpers/random";
import { isAdmin } from "@/helpers/role";
import { prisma } from "@/models";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { PreferenceModel } from "@/models/preference";
import { VoteModel } from "@/models/vote";
import { RatingRepo } from "@/types/repositories/ratingRepo";
import { ILoggedUserMiddleware } from "@/types/user";
import { Gender } from "@prisma/client";
import { ETHNICITY } from "@shared/constants/user";
import { Request, Response } from "express";
import { omit } from "underscore";

export const vote = (ratingRepo: RatingRepo) => async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser as ILoggedUserMiddleware;
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

  const loserPicture = match.pictures.find((picture) => picture.id !== winnerPictureId);

  let winnerVoterInfo: Partial<{
    winnerVoterCountry: string;
    winnerVoterEthnicity: string;
    winnerVoterAge: number;
    winnerVoterGender: Gender;
  }> = {};

  let loserVoterInfo: Partial<{
    loserVoterCountry: string;
    loserVoterEthnicity: string;
    loserVoterAge: number;
    loserVoterGender: Gender;
  }> = {};

  if (isAdmin(loggedUser.role) || loggedUser.canBypassPreferences) {
    const preferenceLoser = await PreferenceModel.findUnique({
      where: {
        userId: loserPicture?.userId,
      },
    });

    if (preferenceLoser) {
      const filteredAgeDistribution = Object.fromEntries(
        Object.entries(FAKE_AGE_DISTRIBUTION).filter(
          ([k, v]) =>
            Number(k) >= preferenceLoser.exposureMinAge &&
            (!preferenceLoser.exposureMaxAge || Number(k) <= preferenceLoser.exposureMaxAge)
        )
      );

      if (Object.keys(filteredAgeDistribution).length === 0) {
        filteredAgeDistribution[25] = 1;
      }

      const age = Number(pickRandomKey(filteredAgeDistribution));
      loserVoterInfo.loserVoterAge = age;

      if (preferenceLoser.exposureGender) {
        loserVoterInfo.loserVoterGender = preferenceLoser.exposureGender;
      } else {
        const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
        loserVoterInfo.loserVoterGender = gender;
      }
    } else {
      const age = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
      const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
      loserVoterInfo.loserVoterAge = age;
      loserVoterInfo.loserVoterGender = gender;
    }

    const preferenceWinner = await PreferenceModel.findUnique({
      where: {
        userId: winnerPicture?.userId,
      },
    });

    if (preferenceWinner) {
      const filteredAgeDistribution = Object.fromEntries(
        Object.entries(FAKE_AGE_DISTRIBUTION).filter(
          ([k, v]) =>
            Number(k) >= preferenceWinner.exposureMinAge &&
            (!preferenceWinner.exposureMaxAge || Number(k) <= preferenceWinner.exposureMaxAge)
        )
      );

      if (Object.keys(filteredAgeDistribution).length === 0) {
        filteredAgeDistribution[25] = 1;
      }

      const age = Number(pickRandomKey(filteredAgeDistribution));
      winnerVoterInfo.winnerVoterAge = age;

      if (preferenceWinner.exposureGender) {
        winnerVoterInfo.winnerVoterGender = preferenceWinner.exposureGender;
      } else {
        const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
        winnerVoterInfo.winnerVoterGender = gender;
      }
    } else {
      const age = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
      const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
      winnerVoterInfo.winnerVoterAge = age;
      winnerVoterInfo.winnerVoterGender = gender;
    }

    const country = pickRandomKey(FAKE_COUNTRY_DISTRIBUTION);
    let ethnicity = FAKE_MAIN_ETHNICITY[country];
    if (Math.random() > 1 - FAKE_OTHER_RACE_PROB[country]) {
      ethnicity = ETHNICITY[Math.floor(Math.random() * ETHNICITY.length)];
    }

    loserVoterInfo = {
      ...loserVoterInfo,
      loserVoterCountry: country,
      loserVoterEthnicity: ethnicity,
    };

    winnerVoterInfo = {
      ...winnerVoterInfo,
      winnerVoterCountry: country,
      winnerVoterEthnicity: ethnicity,
    };
  }

  const createNewVote = VoteModel.create({
    data: {
      ...loserVoterInfo,
      ...winnerVoterInfo,
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
  if (winnerPicture && loserPicture) {
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
