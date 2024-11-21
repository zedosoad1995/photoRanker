import { z } from "zod";

export const createPictureSchema = z
  .object({
    isGlobal: z.boolean().optional(),
    age: z.number().min(18)
  })
  .strict();
