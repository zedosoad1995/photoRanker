import { LocalStorageInteractor } from "./repositories/storage/localStorage";
import { S3Client } from "@aws-sdk/client-s3";
import { S3Interactor } from "./repositories/storage/s3";
import { Glicko2 } from "./repositories/rating/glicko2";
import { Elo } from "./repositories/rating/elo";
import { createClient } from "@supabase/supabase-js";
import { SupabaseInteractor } from "./repositories/storage/supabase";

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
export const mainStorageInteractor = s3Interactor;

export const elo = new Elo();
export const glicko2 = new Glicko2();
