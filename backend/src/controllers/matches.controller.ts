import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { Request, Response } from "express";

export const createOne = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  var [picture1, picture2] = await PictureModel.getMatchWithClosestEloStrategy(loggedUser.id);

  const match = await MatchModel.upsert({
    update: {
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
        },
      },
    },
  });

  res.status(201).send({ match });
};
