import { z } from "zod";

export const getManyPicturesSchema = z
  .object({
    hasReport: z.boolean(),
    belongsToMe: z.boolean(),
    isBanned: z.boolean(),
    userId: z.string(),
  })
  .partial();
