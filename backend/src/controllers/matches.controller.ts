import { BadRequestError } from "@/errors/BadRequestError";
import { prisma } from "@/models";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import _ from "underscore";

export const createOne = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  var [picture1, picture2] = await PictureModel.getMatchWithClosestEloStrategy(loggedUser.id);

  const [doesNotMatter, match] = await prisma.$transaction(
    [
      MatchModel.deleteMany({
        where: {
          activeUser: {
            id: loggedUser.id,
          },
        },
      }),
      MatchModel.create({
        data: {
          activeUser: {
            connect: {
              id: loggedUser.id,
            },
          },
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
        include: {
          pictures: {
            select: {
              id: true,
              filepath: true,
            },
          },
        },
      }),
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    }
  );

  res.status(201).send({ match });
};
