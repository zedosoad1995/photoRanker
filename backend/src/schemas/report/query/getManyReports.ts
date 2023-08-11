import { ORDER_BY_DIR } from "@/constants/query";
import { z } from "zod";

export const getManyReportsSchema = z
  .object({
    userId: z.string(),
    pictureId: z.string(),
    orderBy: z.enum(["createdAt"]),
    orderByDir: z.enum(Object.values(ORDER_BY_DIR) as unknown as [string, ...string[]]),
  })
  .partial();
