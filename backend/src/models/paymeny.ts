import { PURCHASE_TYPE, PURCHASE_AMOUNT } from "@shared/constants/purchase";

interface IPurchaseMetadata {
  amount: number;
  metadata: {
    type: (typeof PURCHASE_TYPE)[keyof typeof PURCHASE_TYPE];
    [k: string]: any;
  };
}

export const getPurchaseAmountAndMetadata = (purchaseType: string): IPurchaseMetadata | null => {
  switch (purchaseType) {
    case PURCHASE_TYPE.INCREASE_PHOTOS:
      return {
        amount: PURCHASE_AMOUNT[PURCHASE_TYPE.INCREASE_PHOTOS],
        metadata: {
          numPhotos: 100,
          type: purchaseType,
        },
      };
    default:
      return null;
  }
};
