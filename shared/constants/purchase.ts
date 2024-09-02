export const PURCHASE_TYPE = {
  INCREASE_PHOTOS: "increase-photos",
  UNLIMITED_VOTES: "unlimited-votes",
  UNLIMITED_STATS: "unlimited-stats",
} as const;

export type IPurchaseType = (typeof PURCHASE_TYPE)[keyof typeof PURCHASE_TYPE];

// In cents (euros)
export const PURCHASE_AMOUNT = {
  [PURCHASE_TYPE.INCREASE_PHOTOS]: 499,
  [PURCHASE_TYPE.UNLIMITED_VOTES]: 499,
  [PURCHASE_TYPE.UNLIMITED_STATS]: 299,
} as const;

export const MAX_FREE_PHOTOS = 10;
export const MAX_PAID_PHOTOS = 100;

export const MAX_FREE_VOTES = 20;

export const MAX_FREE_STATS_PER_PIC = 1;
