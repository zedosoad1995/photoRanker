import { ORDER_BY_DIR } from "@/constants/query";
import { Gender } from "@prisma/client";
import { MIN_AGE } from "@shared/constants/user";
import { z } from "zod";

export const getManyPicturesSchema = z
  .object({
    hasReport: z.enum(["false", "true", ""]),
    belongsToMe: z.enum(["false", "true", ""]),
    isBanned: z.enum(["false", "true", ""]),
    userId: z.string(),
    minAge: z.number().min(MIN_AGE),
    maxAge: z.number().min(MIN_AGE),
    gender: z.union([z.enum(Object.values(Gender) as unknown as [string, ...string[]]), z.null()]),
    limit: z
      .string()
      .refine((limit) => !isNaN(parseInt(limit)), "Expected number")
      .refine((limit) => parseInt(limit) > 0, "Must be greater than zero"),
    cursor: z.string(),
    orderBy: z.enum(["score", "numVotes", "createdAt", "reportedDate"]),
    orderByDir: z.enum(Object.values(ORDER_BY_DIR) as unknown as [string, ...string[]]),
  })
  .partial()
  .refine((data) => !data.maxAge || !data.minAge || data.maxAge >= data.minAge, {
    message: "'maxAge' must be greater or equal than 'minAge'",
    path: ["maxAge"],
  });
