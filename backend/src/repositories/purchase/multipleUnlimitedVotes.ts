import { BadRequestError } from "@/errors/BadRequestError";
import { prisma } from "@/models";
import { PurchaseRepo } from "@/types/repositories/purchase";
import { ILoggedUserMiddleware } from "@/types/user";
import {
  PURCHASE_AMOUNT,
  PURCHASE_TYPE,
  UNLIMITED_VOTE_MULTIPLE_ON,
} from "@shared/constants/purchase";
import { ICreatePaymentIntentMultipleUnlimitedVotes } from "@/schemas/purchase/createPaymentIntentMultipleUnlimitedVotes";

type IExtraProps = ICreatePaymentIntentMultipleUnlimitedVotes;

export class MultipleUnlimitedVotes implements PurchaseRepo<IExtraProps> {
  purchaseName = PURCHASE_TYPE.UNLIMITED_VOTES_ALL;

  public async hasAlreadyBeenPurchased(user: ILoggedUserMiddleware, { pictureIds }: IExtraProps) {
    const picsToPurchase = await prisma.picture.findMany({
      where: {
        userId: user.id,
        id: {
          in: pictureIds,
        },
      },
      select: {
        id: true,
        hasPurchasedUnlimitedVotes: true,
      },
    });

    const nonExistingPics = pictureIds.filter(
      (item) => !picsToPurchase.map((pic) => pic.id).includes(item)
    );

    if (nonExistingPics.length > 0) {
      throw new BadRequestError(`The following 'pictureIds' do not exist: ${nonExistingPics}`);
    }

    const alreadyPurchasedPics = picsToPurchase
      .filter((p) => p.hasPurchasedUnlimitedVotes)
      .map((p) => p.id);
    if (alreadyPurchasedPics.length > 0) {
      throw new BadRequestError(
        `The following 'pictureIds' have already been purchased: ${alreadyPurchasedPics} `
      );
    }

    return false;
  }

  public getPurchaseAmountAndMetadata() {
    if (UNLIMITED_VOTE_MULTIPLE_ON) {
      return {
        amount: PURCHASE_AMOUNT[this.purchaseName],
        metadata: {
          type: this.purchaseName,
        },
      };
    }

    return null;
  }

  public async handlePurchase(userId: string, { pictureIds }: IExtraProps) {
    await prisma.picture.updateMany({
      where: {
        userId,
        id: {
          in: pictureIds,
        },
      },
      data: {
        hasPurchasedUnlimitedVotes: true,
      },
    });
  }
}
