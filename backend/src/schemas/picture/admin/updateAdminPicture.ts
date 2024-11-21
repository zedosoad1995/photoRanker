import { COUNTRIES, ETHNICITY, MIN_AGE } from "@shared/constants/user";
import { z } from "zod";

export const updateAdminPictureSchema = z
  .object({
    countryOfOrigin: z.enum(COUNTRIES as unknown as [string, ...string[]]),
    ethnicity: z.enum(ETHNICITY as unknown as [string, ...string[]]),
    age: z.number().min(MIN_AGE),
  })
  .strict()
  .partial();
