import { TEST_IMAGES_FOLDER_PATH } from "@/constants/picture";
import fs from "fs";

export default async () => {
  fs.rmSync(TEST_IMAGES_FOLDER_PATH, { recursive: true, force: true });
};
