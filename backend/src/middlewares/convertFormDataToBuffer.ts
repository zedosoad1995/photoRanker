import multer from "multer";
import { IMAGE_SIZE_LIMIT } from "@/constants/picture";

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: IMAGE_SIZE_LIMIT,
  },
});

export const convertFormDataToBuffer = uploader.single("image");
