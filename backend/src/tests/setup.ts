import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import fs from "fs";

export default async () => {
  if (!fs.existsSync(TEST_IMAGES_FOLDER_PATH)) {
    fs.mkdirSync(TEST_IMAGES_FOLDER_PATH);
  }
};
