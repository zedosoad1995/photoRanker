import { MEGA_BYTE } from "@shared/constants/unit";

export const IMAGE_UPLOAD_KEY = "image";
export const IMAGE_SIZE_LIMIT = 10 * MEGA_BYTE;
export const TEST_IMAGES_FOLDER_PATH = "storage/testImages";
export const IMAGES_FOLDER_PATH =
  process.env.NODE_ENV === "TEST" ? TEST_IMAGES_FOLDER_PATH : "storage/images";

export const EXTENSION_TO_MIME_TYPE = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};
