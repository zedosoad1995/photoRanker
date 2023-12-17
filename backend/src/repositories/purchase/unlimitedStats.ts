import { prisma } from "@/models";
import { PurchaseRepo } from "@/types/repositories/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import {
  PHOTO_LIMIT_PURCHASE_ON,
  PURCHASE_AMOUNT,
  PURCHASE_TYPE,
} from "@shared/constants/purchase";

export class UnlimitedStats implements PurchaseRepo {
  purchaseName = PURCHASE_TYPE.UNLIMITED_STATS;

  public async hasAlreadyBeenPurchased(user: ILoggedUserMiddleware) {
    return Boolean(user?.purchase?.hasUnlimitedStats);
  }

  public getPurchaseAmountAndMetadata() {
    if (PHOTO_LIMIT_PURCHASE_ON) {
      return {
        amount: PURCHASE_AMOUNT[this.purchaseName],
        metadata: {
          type: this.purchaseName,
        },
      };
    }

    return null;
  }

  public async handlePurchase(userId: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        purchase: {
          upsert: {
            create: {
              hasUnlimitedStats: true,
            },
            update: {
              hasUnlimitedStats: true,
            },
          },
        },
      },
    });
  }
}
