import { COUNTRIES, ETHNICITY } from "@shared/constants/user";
import { z } from "zod";

export const updateAdminPictureSchema = z
  .object({
    countryOfOrigin: z.enum(COUNTRIES as unknown as [string, ...string[]]),
    ethnicity: z.enum(ETHNICITY as unknown as [string, ...string[]]),
  })
  .strict()
  .partial();
