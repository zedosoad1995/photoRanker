export const PURCHASE_TYPE = {
  INCREASE_PHOTOS: "increase-photos",
} as const;

// In Euros
export const PURCHASE_AMOUNT = {
  [PURCHASE_TYPE.INCREASE_PHOTOS]: 4.99,
} as const;
