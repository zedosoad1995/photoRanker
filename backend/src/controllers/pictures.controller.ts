import { PICTURE } from "@/constants/messages";
import { IMAGES_FOLDER_PATH } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { removeFolders } from "@/helpers/file";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { PictureModel } from "@/models/picture";
import { Request, Response } from "express";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import _ from "underscore";
import { parseBoolean, parseNumber, parseOrderBy } from "@/helpers/query";
import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";
import { RATING_INI, RD_INI, VOLATILITY_INI } from "@/constants/rating";
import { MAX_FREE_VOTES } from "@shared/constants/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import { RatingRepo } from "@/types/repositories/ratingRepo";

export const getMany =
  (ratingRepo: RatingRepo, storageInteractor: StorageInteractor) =>
  async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!;
    const userId = req.query.userId as string | undefined;
    const hasReport = parseBoolean(req.query.hasReport as string | undefined);
    const belongsToMe = parseBoolean(req.query.belongsToMe as string | undefined);
    const isBanned = parseBoolean(req.query.isBanned as string | undefined);
    const isGlobal = parseBoolean(req.query.isGlobal as string | undefined) ?? true;
    const gender = req.query.gender as string | undefined;
    const minAge = parseNumber(req.query.minAge as string | undefined);
    const maxAge = parseNumber(req.query.maxAge as string | undefined);
    const limit = parseNumber(req.query.limit as string | undefined);
    const cursor = req.query.cursor as string | undefined;
    const orderBy = req.query.orderBy as string | undefined;
    const orderByDir = req.query.orderByDir as string | undefined;

    const orderByQuery = parseOrderBy({
      orderBy: orderBy as string | undefined,
      orderByDir: orderByDir as ORDER_BY_DIR_OPTIONS_TYPE | undefined,
    });

    if (userId && isRegular(loggedUser.role) && loggedUser.id !== userId) {
      throw new ForbiddenError("User cannot use this endpoint to access pictures from other users");
    }

    if (belongsToMe !== undefined && userId !== undefined) {
      throw new BadRequestError("Cannot call belongsToMe and userId simulataneously");
    }

    const { pictures, nextCursor, ageGroup } = await PictureModel.getPicturesWithPercentile(
      userId,
      loggedUser,
      hasReport,
      belongsToMe,
      isBanned,
      isGlobal,
      gender,
      minAge,
      maxAge,
      limit,
      cursor,
      orderByQuery,
      ratingRepo,
    );

    const retPics = pictures.map((pic) => PictureModel.getReturnPic(pic, storageInteractor));

    res.status(200).json({
      pictures: retPics,
      nextCursor,
      ageGroup,
    });
  };

export const getOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
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
      picture: PictureModel.getReturnPic(picture, storageInteractor),
    });
  };

export const getVotesStats =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const pictureId = req.params.pictureId;
    const loggedUser = req.loggedUser as ILoggedUserMiddleware;

    const picture = await PictureModel.findUnique({
      where: {
        id: pictureId,
      },
    });

    if (!picture || (isRegular(loggedUser.role) && picture.userId !== loggedUser.id)) {
      throw new NotFoundError("Piture not found");
    }

    const stats = await PictureModel.getPictureVotesStats(pictureId, storageInteractor);

    res.status(200).json({ stats });
  };

export const getStats =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const pictureId = req.params.pictureId;
    const loggedUser = req.loggedUser as ILoggedUserMiddleware;

    const stats = await PictureModel.getPictureStats(pictureId, loggedUser, storageInteractor);

    res.status(200).json({ ...stats });
  };

export const checkUploadPermission = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  let canUploadMore = true;

  if (isRegular(loggedUser.role)) {
    const numPictures = await PictureModel.count({
      where: {
        userId: loggedUser.id,
      },
    });

    if (numPictures >= loggedUser.numLimitPhotos) {
      canUploadMore = false;
    }
  }

  res.status(200).json({
    canUploadMore,
  });
};

export const uploadOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser as ILoggedUserMiddleware;
    const isGlobal = req.body.isGlobal;

    if (!req.file) {
      throw new BadRequestError(PICTURE.NO_FILE);
    }

    if (isRegular(loggedUser.role)) {
      const numPictures = await PictureModel.count({
        where: {
          userId: loggedUser.id,
        },
      });

      if (numPictures >= loggedUser.numLimitPhotos) {
        throw new BadRequestError(PICTURE.TOO_MANY_PICTURES(loggedUser.numLimitPhotos));
      }
    }

    const picture = await PictureModel.create({
      data: {
        isGlobal: isGlobal ?? true,
        filepath: encodeURI(removeFolders(req.file.path, IMAGES_FOLDER_PATH)),
        rating: RATING_INI,
        ratingDeviation: RD_INI,
        volatility: VOLATILITY_INI,
        maxFreeVotes: MAX_FREE_VOTES,
        user: {
          connect: {
            id: req.loggedUser?.id,
          },
        },
      },
    });

    res.status(201).json({
      picture: PictureModel.getReturnPic(picture, storageInteractor),
    });
  };

export const updateOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser as ILoggedUserMiddleware;
    const pictureId = req.params.pictureId;

    if (isRegular(loggedUser.role)) {
      const pictureBelongingToUser = await PictureModel.findUnique({
        where: {
          id: pictureId,
          userId: loggedUser.id,
        },
      });

      if (!pictureBelongingToUser) {
        throw new NotFoundError("Picture does not exist or belong to user");
      }
    } else {
      const picture = await PictureModel.findUnique({
        where: {
          id: pictureId,
        },
      });

      if (!picture) {
        throw new NotFoundError("Picture does not exist");
      }
    }

    const picture = await PictureModel.update({
      data: req.body,
      where: { id: pictureId },
    });

    res.status(200).json(PictureModel.getUpdateFieldsToReturn(picture, storageInteractor));
  };

export const deleteOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const pictureId = req.params.pictureId;
    const loggedUser = req.loggedUser as ILoggedUserMiddleware;

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

export const getAdminPics =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const pics = await PictureModel.findMany({
      select: {
        id: true,
        countryOfOrigin: true,
        ethnicity: true,
        filepath: true,
        user: true,
      },
      where: {
        user: {
          role: "ADMIN",
        },
      },
    });

    const transformedPics = pics.map((pic) => ({
      id: pic.id,
      ethnicity: pic.ethnicity ?? pic.user.ethnicity,
      countryOfOrigin: pic.countryOfOrigin ?? pic.user.countryOfOrigin,
      url: storageInteractor.getImageUrl(pic.filepath),
    }));

    res.status(200).json({ pictures: transformedPics });
  };
