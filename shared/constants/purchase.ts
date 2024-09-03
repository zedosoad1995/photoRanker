export type IPurchaseType =
  | "increase-photos"
  | "unlimited-votes"
  | "unlimited-stats";

// In cents (euros)
export const PURCHASE_AMOUNT: Record<IPurchaseType, number> = {
  "increase-photos": 499,
  "unlimited-votes": 499,
  "unlimited-stats": 299,
};

export const MAX_FREE_PHOTOS = 10;
export const MAX_PAID_PHOTOS = 100;

export const MAX_FREE_VOTES = 20;

export const MAX_FREE_STATS_PER_PIC = 1;
