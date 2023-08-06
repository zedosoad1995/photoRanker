import { PICTURE } from "@/constants/messages";
import { IMAGES_FOLDER_PATH } from "@/constants/picture";
import { IMG_HEIGHT, IMG_WIDTH, MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

export const validateImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new BadRequestError(PICTURE.NO_FILE);
  }

  const allowedTypes = [".png", ".jpg", ".jpeg"];
  const extension = path.extname(req.file.originalname).toLowerCase();
  if (!allowedTypes.includes(extension)) {
    throw new BadRequestError(PICTURE.INVALID_EXTENSION);
  }

  const { height, width } = await sharp(req.file.buffer).metadata();
  if (!height || !width || height < MIN_HEIGHT || width < MIN_WIDTH) {
    throw new BadRequestError(PICTURE.IMAGE_DIM_TOO_SMALL);
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  const yearFolder = path.join(IMAGES_FOLDER_PATH, year);
  if (!fs.existsSync(yearFolder)) {
    fs.mkdirSync(yearFolder);
  }

  const monthFolder = path.join(yearFolder, month);
  if (!fs.existsSync(monthFolder)) {
    fs.mkdirSync(monthFolder);
  }

  const dayFolder = path.join(monthFolder, day);
  if (!fs.existsSync(dayFolder)) {
    fs.mkdirSync(dayFolder);
  }

  const uniqueSuffix = crypto.randomBytes(18).toString("hex");
  const fullPath = path.join(dayFolder, uniqueSuffix + extension);

  await sharp(req.file.buffer).resize(IMG_WIDTH, IMG_HEIGHT).toFile(fullPath);
  req.file.path = fullPath;

  return next();
};
