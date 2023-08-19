import { Gender } from "@prisma/client";
import { MIN_AGE } from "@shared/constants/user";
import { z } from "zod";

export const updatePreferenceSchema = z
  .object({
    contentMinAge: z.union([z.number().min(MIN_AGE), z.null()]),
    contentMaxAge: z.union([z.number().min(MIN_AGE), z.null()]),
    contentGender: z.union([
      z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
      z.null(),
    ]),
    exposureMinAge: z.union([z.number().min(MIN_AGE), z.null()]),
    exposureMaxAge: z.union([z.number().min(MIN_AGE), z.null()]),
    exposureGender: z.union([
      z.enum(Object.values(Gender) as unknown as [string, ...string[]]),
      z.null(),
    ]),
  })
  .strict()
  .partial()
  .refine(
    (data) => data.contentMaxAge && data.contentMinAge && data.contentMaxAge >= data.contentMinAge,
    {
      message: "contentMaxAge must be greater than or equal to contentMinAge",
      path: ["contentMaxAge"],
    }
  )
  .refine(
    (data) =>
      data.exposureMaxAge && data.exposureMinAge && data.exposureMaxAge >= data.exposureMinAge,
    {
      message: "exposureMaxAge must be greater than or equal to exposureMinAge",
      path: ["exposureMaxAge"],
    }
  );
