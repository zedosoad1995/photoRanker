import { LocalStorageInteractor } from "./repositories/storage/localStorage";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Interactor } from "./repositories/storage/s3";
import { Glicko2 } from "./repositories/rating/glicko2";
import { Elo } from "./repositories/rating/elo";
import { createClient } from "@supabase/supabase-js";
import { SupabaseInteractor } from "./repositories/storage/supabase";
import { SendGridRepo } from "./repositories/email/sendGrid";
import { GmailRepo } from "./repositories/email/gmail";
import { CloudWatchLogger } from "./repositories/logger/cloudwatch";
import { ConsoleLogger } from "./repositories/logger/console";
import { IncreasePhotos } from "./repositories/purchase/increasePhotos";
import { UnlimitedVotes } from "./repositories/purchase/unlimitedVotes";
import { PURCHASE_TYPE } from "@shared/constants/purchase";
import { MultipleUnlimitedVotes } from "./repositories/purchase/multipleUnlimitedVotes";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_PUB_KEY as string,
  {
    auth: {
      persistSession: false,
    },
  }
);

export const localStorageInteractor = new LocalStorageInteractor();
export const s3Interactor = new S3Interactor(s3);
export const supabaseInteractor = new SupabaseInteractor(supabase);
export const mainStorageInteractor =
  process.env.NODE_ENV === "PROD"
    ? s3Interactor
    : process.env.NODE_ENV === "STG"
    ? supabaseInteractor
    : localStorageInteractor;

export const elo = new Elo();
export const glicko2 = new Glicko2();

export const mailingService =
  process.env.NODE_ENV === "PROD" ? new SendGridRepo() : new GmailRepo();

export const logger =
  process.env.NODE_ENV === "PROD" ? new CloudWatchLogger() : new ConsoleLogger();

// Purchase
export const purchaser = {
  [PURCHASE_TYPE.INCREASE_PHOTOS]: new IncreasePhotos(),
  [PURCHASE_TYPE.UNLIMITED_VOTES_ALL]: new UnlimitedVotes(),
  [PURCHASE_TYPE.UNLIMITED_VOTES_MULTIPLE]: new MultipleUnlimitedVotes(),
};
