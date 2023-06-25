import { Prisma } from "@prisma/client";

export const randomizeVote = (data: Prisma.VoteCreateManyInput) => ({
  ...data,
});
