import { MEGA_BYTE } from "./unit";

export const IMAGE_UPLOAD_KEY = "image";
export const IMAGE_SIZE_LIMIT = 10 * MEGA_BYTE;
export const ELO_INIT = 1000;
export const TEST_IMAGES_FOLDER_PATH = "storage/testImages";
export const IMAGES_FOLDER_PATH =
  process.env.NODE_ENV === "TEST" ? TEST_IMAGES_FOLDER_PATH : "storage/images";
export const MIN_WIDTH = 10;
export const MIN_HEIGHT = 10;
export const IMG_WIDTH = 400;
export const IMG_HEIGHT = 400;
export const LIMIT_PICTURES = 10;
