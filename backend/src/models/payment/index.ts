import {
  PURCHASE_TYPE,
  PURCHASE_AMOUNT,
  IPurchaseType,
  PHOTO_LIMIT_PURCHASE_ON,
} from "@shared/constants/purchase";
import { increasePhotos } from "./increasePhotos";
import { ValidationError } from "@/errors/ValidationError";
import { prisma } from "..";

interface IPurchaseMetadata {
  amount: number;
  metadata: {
    type: IPurchaseType;
    [k: string]: any;
  };
}

export const getPurchaseAmountAndMetadata = (purchaseType: string): IPurchaseMetadata | null => {
  if (purchaseType === PURCHASE_TYPE.INCREASE_PHOTOS && PHOTO_LIMIT_PURCHASE_ON) {
    return {
      amount: PURCHASE_AMOUNT[PURCHASE_TYPE.INCREASE_PHOTOS],
      metadata: {
        type: purchaseType,
      },
    };
  } else {
    return null;
  }
};

export const handlePurchase = async (purchaseType: string, userId: string) => {
  if (purchaseType === PURCHASE_TYPE.INCREASE_PHOTOS) {
    await increasePhotos(userId);
  } else {
    throw new ValidationError({
      message: `Invalid Purchase Type. Given type: ${purchaseType}`,
      path: "metadata.type",
    });
  }
};

export const hasAlreadyBeenPurchased = async (purchaseType: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { purchase: true } });

  if (purchaseType === PURCHASE_TYPE.INCREASE_PHOTOS && user?.purchase?.hasIncreasedPhotoLimit) {
    return true;
  }

  return false;
};
