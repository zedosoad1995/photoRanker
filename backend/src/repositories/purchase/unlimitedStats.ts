import { prisma } from "@/models";
import { PurchaseRepo } from "@/types/repositories/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import { IPurchaseType, PURCHASE_AMOUNT } from "@shared/constants/purchase";

export class UnlimitedStats implements PurchaseRepo {
  purchaseName: IPurchaseType = "unlimited-stats";

  public async hasAlreadyBeenPurchased(user: ILoggedUserMiddleware) {
    return Boolean(user?.purchase?.hasUnlimitedStats);
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
