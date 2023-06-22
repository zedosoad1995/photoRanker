import { IMAGE_SIZE_LIMIT, IMAGE_UPLOAD_KEY } from "./picture";
import bytes from "bytes";

export const PICTURE = {
  INVALID_EXTENSION: "Invalid file type. Only PNG and JPEG files are allowed.",
  INVALID_FORM_KEY: `Invalid form-data key. Picture must be sent using the key: "${IMAGE_UPLOAD_KEY}"`,
  FILE_TOO_LARGE: `File size exceeds the limit (${bytes(IMAGE_SIZE_LIMIT)})`,
  NO_FILE: "No file uploaded",
};
