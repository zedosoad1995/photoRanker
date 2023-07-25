import { z } from "zod";

export const getManyPicturesSchema = z
  .object({
    userId: z.string(),
  })
  .partial();
