import { IMAGES_FOLDER_PATH } from "@/constants/picture";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import crypto from "crypto";
import { IMG_HEIGHT, IMG_WIDTH } from "@shared/constants/picture";
import { StorageInteractor } from "@/types/storageInteractor";

export class LocalStorageInteractor implements StorageInteractor {
  constructor() {}

  async saveNewImage(imageBuffer: Buffer, extension: string) {
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
    const fullPath = path.join(dayFolder, `${uniqueSuffix}.${extension}`);

    await sharp(imageBuffer).resize(IMG_WIDTH, IMG_HEIGHT).toFile(fullPath);

    return fullPath;
  }

  public getImage(imagePath: string) {
    return `${process.env.BACKEND_URL}/image/${imagePath.replace(/\\/g, "/")}`;
  }
}
