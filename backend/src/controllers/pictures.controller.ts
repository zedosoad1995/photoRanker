import { PICTURE } from "@/constants/messages";
import { ELO_INIT } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { isRegular } from "@/helpers/role";
import { PictureModel } from "@/models/picture";
import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";
import _ from "underscore"

export const getMany = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser as User;

  const whereQuery: Prisma.PictureWhereInput = {};
  if (isRegular(loggedUser.role)) {
    whereQuery.userId = loggedUser.id;
  }

  const pictures = await PictureModel.findMany({
    where: whereQuery,
  });

  res.status(200).json({
    pictures,
  });
};

export const getOne = async (req: Request, res: Response) => {
  const pictureId = req.params.pictureId;
  const loggedUser = req.loggedUser as User;

  const picture = await PictureModel.findUnique({
    where: {
      id: pictureId,
    },
  });

  if (!picture) {
    throw new NotFoundError("Picture does not exist");
  }

  if (isRegular(loggedUser.role) && picture?.userId !== loggedUser.id) {
    throw new ForbiddenError("User cannot access this picture");
  }

  res.status(200).json({
    picture,
  });
};

export const uploadOne = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError(PICTURE.NO_FILE);
  }

  const picture = await PictureModel.create({
    data: {
      filepath: req.file.filename,
      elo: ELO_INIT,
      user: {
        connect: {
          id: req.loggedUser?.id,
        },
      },
    },
  });

  res.status(201).json({
    picture,
  });
};

export const deleteOne = async (req: Request, res: Response) => {
  const pictureId = req.params.pictureId;
  const loggedUser = req.loggedUser as User;

  const existingPicture = await PictureModel.findUnique({
    where: {
      id: pictureId,
    },
  });

  if (!existingPicture) {
    throw new NotFoundError("Picture does not exist");
  }

  if (isRegular(loggedUser.role) && existingPicture.userId !== loggedUser.id) {
    throw new ForbiddenError("User cannot delete this picture");
  }

  await PictureModel.delete({
    where: {
      id: pictureId,
    },
  });

  res.sendStatus(204);
};

export const getRandomPair = async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!

    const numPictures = await PictureModel.count({
        where: {
            userId: {
                not:  loggedUser.id
            }
        }
    })

    const randomNumPic1 = _.random(numPictures - 1)
    if(randomNumPic1 < 0){
        throw new BadRequestError("Not enought pictures for match")
    }

    const picture1 = await PictureModel.findFirst({
        where: {
            userId: {
                not:  loggedUser.id
            }
        },
        skip: randomNumPic1,
    })
    if(!picture1){
        throw new BadRequestError("Not enought pictures for match")
    }

    const randomNumPic2 = _.random(numPictures - 2)
    if(randomNumPic2 < 0){
        throw new BadRequestError("Not enought pictures for match")
    }

    const picture2 = await PictureModel.findFirst({
        where: {
            AND: [
                {
                    userId: {
                        not: loggedUser.id
                    }
                },
                {
                    id: {
                        not: picture1.id
                    }
                }
            ]
        },
        skip: randomNumPic2,
    })
    if(!picture2){
        throw new BadRequestError("Not enought pictures for match")
    }

    res.status(200).send({
      picture1,
      picture2
    })
}
