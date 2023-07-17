import { PICTURE } from "@/constants/messages";
import { ELO_INIT, IMAGES_FOLDER_PATH } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { normalizedJoin, removeFolders } from "@/helpers/file";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { Prisma, User, Match } from "@prisma/client";
import { Request, Response } from "express";
import path from "path";

export const getMany = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser as User;

  const whereQuery: Prisma.PictureWhereInput = {};
  if (isRegular(loggedUser.role)) {
    whereQuery.userId = loggedUser.id;
  }

  const pictures = await PictureModel.findMany({
    where: whereQuery,
    orderBy: {
      elo: "desc",
    },
  });

  res.status(200).json({
    pictures,
  });
};

export const getOne = async (req: Request, res: Response) => {
  const pictureId = req.params.pictureId;
  const loggedUser = req.loggedUser!;

  const picture = await PictureModel.findUnique({
    where: {
      id: pictureId,
    },
    include: {
      user: true,
    },
  });

  if (!picture) {
    throw new NotFoundError("Picture does not exist");
  }

  if (isRegular(loggedUser.role)) {
    const activeMatch = picture.user.activeMatchId
      ? await MatchModel.findUnique({
          where: {
            id: picture.user.activeMatchId,
          },
          include: {
            pictures: true,
          },
        })
      : undefined;

    const isPictureInActiveMatch =
      activeMatch && activeMatch.pictures.map((picture) => picture.id).includes(pictureId);

    if (picture?.userId !== loggedUser.id && !isPictureInActiveMatch) {
      throw new ForbiddenError("User cannot access this picture");
    }
  }

  res.status(200).json({
    picture,
  });
};

export const getImageFile = async (req: Request, res: Response) => {
  const imagePath = req.params.imagePath;
  const loggedUser = req.loggedUser!;

  const picture = await PictureModel.findFirst({
    where: {
      filepath: encodeURI(imagePath),
    },
    include: {
      user: true,
    },
  });

  if (!picture) {
    throw new NotFoundError("Picture does not exist");
  }

  if (isRegular(loggedUser.role)) {
    const activeMatch = picture.user.activeMatchId
      ? await MatchModel.findUnique({
          where: {
            id: picture.user.activeMatchId,
          },
          include: {
            pictures: true,
          },
        })
      : undefined;

    const isPictureInActiveMatch =
      activeMatch &&
      activeMatch.pictures.map((picture) => picture.filepath).includes(encodeURI(imagePath));

    if (picture?.userId !== loggedUser.id && !isPictureInActiveMatch) {
      throw new ForbiddenError("User cannot access this picture");
    }
  }

  const fullPath = normalizedJoin(process.cwd(), IMAGES_FOLDER_PATH, decodeURI(imagePath));

  res.sendFile(fullPath);
};

export const uploadOne = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError(PICTURE.NO_FILE);
  }

  const picture = await PictureModel.create({
    data: {
      filepath: encodeURI(removeFolders(req.file.path, IMAGES_FOLDER_PATH)),
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
