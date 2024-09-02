import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { PurchaseRepo } from "@/types/repositories/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import { PURCHASE_AMOUNT, PURCHASE_TYPE } from "@shared/constants/purchase";

export class UnlimitedVotes implements PurchaseRepo {
  purchaseName = PURCHASE_TYPE.UNLIMITED_VOTES;

  public async hasAlreadyBeenPurchased(user: ILoggedUserMiddleware) {
    return Boolean(user?.purchase?.hasUnlimitedVotes);
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
        purchase: {
          upsert: {
            create: {
              hasUnlimitedVotes: true,
            },
            update: {
              hasUnlimitedVotes: true,
            },
          },
        },
      },
    });
  }
}
