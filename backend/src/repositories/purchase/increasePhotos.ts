import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { PurchaseRepo } from "@/types/repositories/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import { MAX_PAID_PHOTOS, PURCHASE_AMOUNT, PURCHASE_TYPE } from "@shared/constants/purchase";

export class IncreasePhotos implements PurchaseRepo {
  purchaseName = PURCHASE_TYPE.INCREASE_PHOTOS;

  public async hasAlreadyBeenPurchased(user: ILoggedUserMiddleware) {
    return Boolean(user?.purchase?.hasIncreasedPhotoLimit);
  }

  public getPurchaseAmountAndMetadata() {
    return {
      amount: PURCHASE_AMOUNT[this.purchaseName],
      metadata: {
        type: this.purchaseName,
      },
    };
  }

  public async handlePurchase(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        numLimitPhotos: MAX_PAID_PHOTOS,
        purchase: {
          upsert: {
            create: {
              hasIncreasedPhotoLimit: true,
            },
            update: {
              hasIncreasedPhotoLimit: true,
            },
          },
        },
      },
    });
  }
}
