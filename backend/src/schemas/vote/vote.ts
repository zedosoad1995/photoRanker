import { z } from "zod";

export const voteSchema = z
  .object({
    matchId: z.string().min(1).max(300),
    winnerPictureId: z.string().min(1).max(300).optional(),
  })
  .strict();
