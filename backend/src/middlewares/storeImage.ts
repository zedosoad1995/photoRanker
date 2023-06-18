import multer from "multer";
import path from "path";
import fs from "fs";

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
});

const uploader = multer({ storage });

export const storeImage = uploader.single("image");
