import { z } from "zod";

export const createPictureSchema = z
  .object({
    isGlobal: z.boolean().optional(),
  })
  .strict();
