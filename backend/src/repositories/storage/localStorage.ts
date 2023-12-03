import { IMAGES_FOLDER_PATH } from "@/constants/picture";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import crypto from "crypto";
import { StorageInteractor } from "@/types/repositories/storageInteractor";

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

    await sharp(imageBuffer).toFile(fullPath);

    return fullPath;
  }

  public getBaseDir() {
    return `${process.env.BACKEND_URL}/image`;
  }

  public getImageUrl(imagePath: string) {
    return `${this.getBaseDir()}/${imagePath.replace(/\\/g, "/")}`;
  }

  public async deleteImage(encodedImagePage: string) {
    const fullPath = path.join(IMAGES_FOLDER_PATH, decodeURI(encodedImagePage).replace(/\\/g, "/"));

    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(error);
    }
  }
}
