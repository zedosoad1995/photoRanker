import {
  IMAGE_SIZE_LIMIT,
  IMAGE_UPLOAD_KEY,
  LIMIT_PICTURES,
  MIN_HEIGHT,
  MIN_WIDTH,
} from "./picture";
import bytes from "bytes";

export const PICTURE = {
  INVALID_EXTENSION: "Invalid file type. Only PNG and JPEG files are allowed.",
  INVALID_FORM_KEY: `Invalid form-data key. Picture must be sent using the key: "${IMAGE_UPLOAD_KEY}"`,
  FILE_TOO_LARGE: `File size exceeds the limit (${bytes(IMAGE_SIZE_LIMIT)})`,
  NO_FILE: "No file uploaded",
  IMAGE_DIM_TOO_SMALL: `Image height must be at least ${MIN_HEIGHT} and width at least ${MIN_WIDTH}`,
  TOO_MANY_PICTURES: `You have have reached the limit of ${LIMIT_PICTURES} pictures. To upload a new picture you must delete other`,
};

export const AUTH = {
  GOOGLE: {
    NO_ACCESS_TOKEN: "Google access token is not defined",
    UNVERIFIED_EMAIL: "Emails is not verified",
    NON_EXISTING_USER: "User does not exist. Invalid email or googleId",
  },
};
