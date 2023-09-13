import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { PreferenceModel } from "@/models/preference";
import { RatingRepo } from "@/types/ratingRepo";
import { StorageInteractor } from "@/types/storageInteractor";
import { Request, Response } from "express";

export const createOne =
  (ratingRepo: RatingRepo, storageInteractor: StorageInteractor) =>
  async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!;

    const userPreferences = await PreferenceModel.findUnique({
      where: {
        userId: loggedUser.id,
      },
    });

    var [picture1, picture2] = await PictureModel.getMatchWithClosestEloStrategy(
      loggedUser,
      userPreferences
    );

    const match = await MatchModel.upsert({
      update: {
        pictures: {
          set: [
            {
              id: picture1.id,
            },
            {
              id: picture2.id,
            },
          ],
        },
      },
      create: {
        activeUserId: loggedUser.id,
        pictures: {
          connect: [
            {
              id: picture1.id,
            },
            {
              id: picture2.id,
            },
          ],
        },
      },
      where: {
        activeUserId: loggedUser.id,
      },
      include: {
        pictures: {
          select: {
            id: true,
            filepath: true,
            rating: true,
            ratingDeviation: true,
            volatility: true,
          },
        },
      },
    });

    const winProbability = ratingRepo.getWinProbability(match.pictures[0], match.pictures[1]);

    const picturesWithOmmited = match.pictures.map((pic) =>
      PictureModel.getReturnPic(pic, storageInteractor)
    );

    res.status(201).send({ match: { ...match, pictures: picturesWithOmmited, winProbability } });
  };
