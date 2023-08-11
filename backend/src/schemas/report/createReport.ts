import { z } from "zod";

export const createReportSchema = z
  .object({
    pictureId: z.string(),
  })
  .strict();
