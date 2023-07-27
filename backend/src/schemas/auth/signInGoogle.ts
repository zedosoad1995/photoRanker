import { z } from "zod";

export const signInGoogleSchema = z
  .object({
    code: z.string(),
  })
  .strict();
