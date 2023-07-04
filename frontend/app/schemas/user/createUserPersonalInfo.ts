import { z } from "zod";

export const createUserPersonalInfoSchema = z
  .object({
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
  })
  .strict();

export type ICreateUserPersonalInfo = z.infer<
  typeof createUserPersonalInfoSchema
>;
