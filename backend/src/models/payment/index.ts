import {
  PURCHASE_TYPE,
  PURCHASE_AMOUNT,
  IPurchaseType,
  PHOTO_LIMIT_PURCHASE_ON,
} from "@shared/constants/purchase";
import { increasePhotos } from "./increasePhotos";
import { ValidationError } from "@/errors/ValidationError";

interface IPurchaseMetadata {
  amount: number;
  metadata: {
    type: IPurchaseType;
    [k: string]: any;
  };
}

export const getPurchaseAmountAndMetadata = (purchaseType: string): IPurchaseMetadata | null => {
  switch (purchaseType) {
    case PURCHASE_TYPE.INCREASE_PHOTOS:
      return {
        amount: PURCHASE_AMOUNT[PURCHASE_TYPE.INCREASE_PHOTOS],
        metadata: {
          type: purchaseType,
        },
      };
    default:
      return null;
  }
};

export const handlePurchase = async (purchaseType: string, userId: string) => {
  if (purchaseType === PURCHASE_TYPE.INCREASE_PHOTOS && PHOTO_LIMIT_PURCHASE_ON) {
    await increasePhotos(userId);
  } else {
    throw new ValidationError({
      message: `Invalid Purchase Type. Given type: ${purchaseType}`,
      path: "metadata.type",
    });
  }
};
