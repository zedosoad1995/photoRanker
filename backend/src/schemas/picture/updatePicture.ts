import { z } from "zod";

export const updatePictureSchema = z
  .object({
    isActive: z.boolean().optional(),
  })
  .strict();
