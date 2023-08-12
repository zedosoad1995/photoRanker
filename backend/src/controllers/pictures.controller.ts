import { PICTURE } from "@/constants/messages";
import { ELO_INIT, IMAGES_FOLDER_PATH } from "@/constants/picture";
import { LIMIT_PICTURES } from "@shared/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { removeFolders } from "@/helpers/file";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { StorageInteractor } from "@/types/storageInteractor";
import _ from "underscore";
import { parseBoolean } from "@/helpers/query";

export const getMany = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const userId = req.query.userId as string | undefined;
  const hasReport = parseBoolean(req.query.hasReport as string | undefined);
  const belongsToMe = parseBoolean(req.query.belongsToMe as string | undefined);
  const isBanned = parseBoolean(req.query.isBanned as string | undefined);

  if (userId && isRegular(loggedUser.role) && loggedUser.id !== userId) {
    throw new ForbiddenError("User cannot use this endpoint to access pictures from other users");
  }

  if (belongsToMe !== undefined && userId !== undefined) {
    throw new BadRequestError("Cannot call belongsToMe and userId simulataneously");
  }

  const pictures = await PictureModel.getPicturesWithPercentile(
    userId,
    loggedUser.id,
    loggedUser.role,
    hasReport,
    belongsToMe,
    isBanned
  );

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
    const activeMatch = loggedUser.activeMatch?.id
      ? await MatchModel.findUnique({
          where: {
            id: loggedUser.activeMatch.id,
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

export const getImageFile =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
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
      const activeMatch = loggedUser.activeMatch?.id
        ? await MatchModel.findUnique({
            where: {
              id: loggedUser.activeMatch.id,
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

    res.status(200).json({
      url: storageInteractor.getImageUrl(imagePath),
    });
  };

export const uploadOne = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  if (!req.file) {
    throw new BadRequestError(PICTURE.NO_FILE);
  }

  if (isRegular(loggedUser.role)) {
    const numPictures = await PictureModel.count({
      where: {
        userId: loggedUser.id,
      },
    });

    if (numPictures >= LIMIT_PICTURES) {
      throw new BadRequestError(PICTURE.TOO_MANY_PICTURES);
    }
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

export const deleteOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
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

    const deletePicture = await PictureModel.delete({
      where: {
        id: pictureId,
      },
    });

    await storageInteractor.deleteImage(deletePicture.filepath);

    res.sendStatus(204);
  };
