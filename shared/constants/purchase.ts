export const PURCHASE_TYPE = {
  INCREASE_PHOTOS: "increase-photos",
  UNLIMITED_VOTES_ALL: "unlimited-votes-all",
  UNLIMITED_VOTES_MULTIPLE: "unlimited-votes-multiple",
  UNLIMITED_STATS: "unlimited-stats",
} as const;

export type IPurchaseType = (typeof PURCHASE_TYPE)[keyof typeof PURCHASE_TYPE];

// In cents (euros)
export const PURCHASE_AMOUNT = {
  [PURCHASE_TYPE.INCREASE_PHOTOS]: 499,
  [PURCHASE_TYPE.UNLIMITED_VOTES_ALL]: 499,
  [PURCHASE_TYPE.UNLIMITED_VOTES_MULTIPLE]: 99,
  [PURCHASE_TYPE.UNLIMITED_STATS]: 299,
} as const;

export const PHOTO_LIMIT_PURCHASE_ON = false;
export const MAX_FREE_PHOTOS = 20;
export const MAX_PAID_PHOTOS = 100;

export const UNLIMITED_VOTE_ALL_ON = false;
export const MAX_FREE_VOTES = 30;

export const UNLIMITED_VOTE_MULTIPLE_ON = false;

export const UNLIMITED_STATS_ON = true;
export const MAX_FREE_STATS_PER_PIC = 2;
