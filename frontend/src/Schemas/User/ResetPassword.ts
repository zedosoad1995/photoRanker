import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6).max(30),
  })
  .strict();

export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
