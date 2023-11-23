import { z } from "zod";

export const createPaymentIntentMultipleUnlimitedVotesSchema = z
  .object({
    pictureIds: z.array(z.string()).min(1).max(200),
  })
  .strict();

export type ICreatePaymentIntentMultipleUnlimitedVotes = z.infer<
  typeof createPaymentIntentMultipleUnlimitedVotesSchema
>;
