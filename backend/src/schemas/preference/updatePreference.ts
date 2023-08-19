import { Gender } from "@prisma/client";
import { MIN_AGE } from "@shared/constants/user";
import { z } from "zod";

export const updatePreferenceSchema = z
  .object({
    contentMinAge: z.union([z.number().min(MIN_AGE), z.null()]),
    contentMaxAge: z.union([z.number(), z.null()]),
    contentGender: z.union([
      z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
      z.null(),
    ]),
    exposureMinAge: z.union([z.number().min(MIN_AGE), z.null()]),
    exposureMaxAge: z.union([z.number(), z.null()]),
    exposureGender: z.union([
      z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
      z.null(),
    ]),
  })
  .strict()
  .partial();
