import { COUNTRIES, ETHNICITY } from "@/constants/user";
import { isValidDateFormat } from "@/helpers/date";
import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    countryOfOrigin: z.enum(COUNTRIES as unknown as [string, ...string[]]),
    ethnicity: z.enum(ETHNICITY as unknown as [string, ...string[]]),
    dateOfBirth: z.string().refine(isValidDateFormat, "Must be a valid date in format yyyy-MM-dd"),
  })
  .strict();

export type ICreateUser = z.infer<typeof createUserSchema>;
