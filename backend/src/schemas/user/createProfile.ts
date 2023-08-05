import { COUNTRIES, ETHNICITY, MIN_AGE } from "@/constants/user";
import { isAboveAge, isValidDateFormat } from "@/helpers/date";
import { Gender } from "@prisma/client";
import { z } from "zod";

export const createProfileSchema = z
  .object({
    countryOfOrigin: z.enum(COUNTRIES as unknown as [string, ...string[]]),
    ethnicity: z.enum(ETHNICITY as unknown as [string, ...string[]]),
    gender: z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
    dateOfBirth: z
      .string()
      .refine(isValidDateFormat, "Must be a valid date in format yyyy-MM-dd")
      .refine(isAboveAge(MIN_AGE)),
  })
  .strict();

export type ICreateProfile = z.infer<typeof createProfileSchema>;
