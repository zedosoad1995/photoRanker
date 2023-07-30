import { z } from "zod";

export const signInFacebookSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .strict();

export type ISignInFacebook = z.infer<typeof signInFacebookSchema>;
