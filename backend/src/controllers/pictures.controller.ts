import { PICTURE } from "@/constants/messages";
import { ELO_INIT, IMAGES_FOLDER_PATH, LIMIT_PICTURES } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { normalizedJoin, removeFolders } from "@/helpers/file";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";

export const getMany = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const userId = req.query.userId as string | undefined;

  if (userId && isRegular(loggedUser.role) && loggedUser.id !== userId) {
    throw new ForbiddenError("User cannot use this endpoint to access pictures from other users");
  }

  const whereQuery: Prisma.PictureWhereInput = {};
  if (userId) {
    whereQuery.userId = userId;
  } else if (isRegular(loggedUser.role)) {
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
    const activeMatch = loggedUser.activeMatchId
      ? await MatchModel.findUnique({
          where: {
            id: loggedUser.activeMatchId,
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
    const activeMatch = loggedUser.activeMatchId
      ? await MatchModel.findUnique({
          where: {
            id: loggedUser.activeMatchId,
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
