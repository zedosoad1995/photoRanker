import { LocalStorageInteractor } from "./repositories/storage/localStorage";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Interactor } from "./repositories/storage/s3";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const localStorageInteractor = new LocalStorageInteractor();
export const s3Interactor = new S3Interactor(s3);
export const mainStorageInteractor = localStorageInteractor;
