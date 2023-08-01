import { z } from "zod";

export const signInFacebookSchema = z
  .object({
    code: z.string(),
  })
  .strict();
