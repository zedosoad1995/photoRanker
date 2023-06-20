import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "@/errors/BadRequestError";
import { IMAGE_SIZE_LIMIT } from "@/constants/picture";
import crypto from "crypto"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    const yearFolder = path.join("storage/images", year);
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

    cb(null, dayFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(18).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const uploader = multer({
  storage,
  limits: {
    fileSize: IMAGE_SIZE_LIMIT,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".png", ".jpg", ".jpeg"];

    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          "Invalid file type. Only PNG and JPEG files are allowed."
        )
      );
    }
  },
});

export const storeImage = uploader.single("image");
