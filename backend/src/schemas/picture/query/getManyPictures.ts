import { z } from "zod";

export const getManyPicturesSchema = z
  .object({
    hasReport: z.enum(["false", "true", ""]),
    belongsToMe: z.enum(["false", "true", ""]),
    isBanned: z.enum(["false", "true", ""]),
    userId: z.string(),
  })
  .partial();
