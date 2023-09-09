import { z } from "zod";
import { isAboveAge, isValidDateFormat } from "@shared/helpers/date";
import { MIN_AGE } from "@shared/constants/user";

export const CreateUserPersonalInfoSchema = z
  .object({
    dateOfBirth: z
      .string()
      .min(1, "Date of Birth is required")
      .refine(isValidDateFormat, "Invalid Date of Birth")
      .refine(isAboveAge(MIN_AGE), `Must be at least ${MIN_AGE} years old`),
  })
  .strict();

export type ICreateUserPersonalInfo = z.infer<typeof CreateUserPersonalInfoSchema>;
