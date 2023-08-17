import { ORDER_BY_DIR } from "@/constants/query";
import { z } from "zod";

export const getManyPicturesSchema = z
  .object({
    hasReport: z.enum(["false", "true", ""]),
    belongsToMe: z.enum(["false", "true", ""]),
    isBanned: z.enum(["false", "true", ""]),
    userId: z.string(),
    limit: z.number().min(1),
    cursor: z.string(),
    orderBy: z.enum(["score", "numVotes", "createdAt", "reportedDate"]),
    orderByDir: z.enum(Object.values(ORDER_BY_DIR) as unknown as [string, ...string[]]),
  })
  .partial();
