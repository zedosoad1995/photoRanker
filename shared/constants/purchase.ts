export const PURCHASE_TYPE = {
  INCREASE_PHOTOS: "increase-photos",
} as const;

export type IPurchaseType = (typeof PURCHASE_TYPE)[keyof typeof PURCHASE_TYPE];

// In cents (euros)
export const PURCHASE_AMOUNT = {
  [PURCHASE_TYPE.INCREASE_PHOTOS]: 499,
} as const;

export const PHOTO_LIMIT_PURCHASE_ON = true;
export const MAX_FREE_PHOTOS = 20;
export const MAX_PAID_PHOTOS = 100;
