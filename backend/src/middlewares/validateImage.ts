import { PICTURE } from "@/constants/messages";
import { IMG_HEIGHT, IMG_WIDTH, MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import { StorageInteractor } from "@/types/storageInteractor";

export const validateImage =
  (imageStorageInteractor: StorageInteractor) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new BadRequestError(PICTURE.NO_FILE);
    }

    const allowedTypes = ["png", "jpg", "jpeg"];
    const extension = path.extname(req.file.originalname).toLowerCase().slice(1);
    if (!allowedTypes.includes(extension)) {
      throw new BadRequestError(PICTURE.INVALID_EXTENSION);
    }

    const { height, width } = await sharp(req.file.buffer).metadata();
    if (!height || !width || height < MIN_HEIGHT || width < MIN_WIDTH) {
      throw new BadRequestError(PICTURE.IMAGE_DIM_TOO_SMALL);
    }

    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(IMG_WIDTH, IMG_HEIGHT)
      .toBuffer();

    const fullPath = await imageStorageInteractor.saveNewImage(resizedImageBuffer, extension);

    req.file.path = fullPath;

    return next();
  };
