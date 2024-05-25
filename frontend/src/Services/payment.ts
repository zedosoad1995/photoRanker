import { PURCHASE_TYPE } from "@shared/constants/purchase";
import { ICreatePaymentIntent } from "@/Types/payment";
import api from ".";

type ICreatePaymentIntentInput =
  | {
      purchaseType:
        | typeof PURCHASE_TYPE.INCREASE_PHOTOS
        | typeof PURCHASE_TYPE.UNLIMITED_VOTES_ALL
        | typeof PURCHASE_TYPE.UNLIMITED_STATS;
    }
  | { purchaseType: typeof PURCHASE_TYPE.UNLIMITED_VOTES_MULTIPLE; pictureIds: string[] };

export const createPaymentIntent = async (
  props: ICreatePaymentIntentInput
): Promise<ICreatePaymentIntent> => {
  switch (props.purchaseType) {
    case "increase-photos":
      return api.post(`/payments/create-payment-intent/increase-photos`);
    case "unlimited-votes-all":
      return api.post(`/payments/create-payment-intent/unlimited-votes`);
    case "unlimited-stats":
      return api.post(`/payments/create-payment-intent/unlimited-stats`);
    case "unlimited-votes-multiple":
      return api.post(`/payments/create-payment-intent/multiple-unlimited-votes`, {
        pictureIds: props.pictureIds,
      });
    default:
      throw new Error("Invalid path");
  }
};
