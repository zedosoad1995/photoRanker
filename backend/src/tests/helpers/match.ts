import { Prisma } from "@prisma/client";

export const randomizeMatch = (
  data: Partial<Prisma.MatchCreateInput> = {}
) => ({
  ...data,
});
