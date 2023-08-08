import { COUNTRIES, ETHNICITY, MIN_AGE } from "@shared/constants/user";
import { isAboveAge, isValidDateFormat } from "@/helpers/date";
import { Gender } from "@prisma/client";
import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(50),
    password: z.string().min(6).max(30),
    countryOfOrigin: z.enum(COUNTRIES as unknown as [string, ...string[]]),
    ethnicity: z.enum(ETHNICITY as unknown as [string, ...string[]]),
    gender: z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
    dateOfBirth: z
      .string()
      .refine(isValidDateFormat, "Must be a valid date in format yyyy-MM-dd")
      .refine(isAboveAge(MIN_AGE)),
  })
  .strict()
  .partial();
