import { LocalStorageInteractor } from "./repositories/storage/localStorage";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Interactor } from "./repositories/storage/s3";
import { Glicko2 } from "./repositories/rating/glicko2";
import { Elo } from "./repositories/rating/elo";
import { SendGridRepo } from "./repositories/email/sendGrid";
import { GmailRepo } from "./repositories/email/gmail";
import { CloudWatchLogger } from "./repositories/logger/cloudwatch";
import { ConsoleLogger } from "./repositories/logger/console";
import { IncreasePhotos } from "./repositories/purchase/increasePhotos";
import { UnlimitedVotes } from "./repositories/purchase/unlimitedVotes";
import { IPurchaseType } from "@shared/constants/purchase";
import { UnlimitedStats } from "./repositories/purchase/unlimitedStats";
import { PurchaseRepo } from "./types/repositories/purchase";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const localStorageInteractor = new LocalStorageInteractor();
export const s3Interactor = new S3Interactor(s3);
export const mainStorageInteractor = ["PROD", "STG"].includes(process.env.NODE_ENV as string)
  ? s3Interactor
  : localStorageInteractor;

export const elo = new Elo();
export const glicko2 = new Glicko2();

export const mailingService =
  process.env.NODE_ENV === "PROD" ? new SendGridRepo() : new GmailRepo();

export const logger =
  process.env.NODE_ENV === "PROD" ? new CloudWatchLogger() : new ConsoleLogger();

// Purchase
export const purchaser: Record<IPurchaseType, PurchaseRepo> = {
  "increase-photos": new IncreasePhotos(),
  "unlimited-votes": new UnlimitedVotes(),
  "unlimited-stats": new UnlimitedStats(),
};
