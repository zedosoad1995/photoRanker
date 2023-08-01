import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6).max(30),
  })
  .strict();
