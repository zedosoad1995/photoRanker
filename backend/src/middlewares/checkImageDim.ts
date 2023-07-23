import { PICTURE } from "@/constants/messages";
import { MIN_HEIGHT, MIN_WIDTH } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export const checkImageDim = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  const { height, width } = await sharp(req.file?.buffer).metadata();

  if (!height || !width || height < MIN_HEIGHT || width < MIN_WIDTH) {
    throw new BadRequestError(PICTURE.IMAGE_DIM_TOO_SMALL);
  }

  return next();
};
