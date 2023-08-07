import { LocalStorageInteractor } from "./repositories/localStorage";
import AWS from "aws-sdk";
import { S3Interactor } from "./repositories/s3";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const localStorageInteractor = new LocalStorageInteractor();
export const s3Interactor = new S3Interactor(s3);
