import { PURCHASE_TYPE } from "@shared/constants/purchase";
import { z } from "zod";

export const createPaymentIntentSchema = z
  .object({
    purchaseType: z.enum(Object.values(PURCHASE_TYPE) as unknown as [string, ...string[]]),
  })
  .strict();
