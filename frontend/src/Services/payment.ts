import { ICreatePaymentIntent } from "@/Types/payment";
import api from ".";
import { IPurchaseType } from "@shared/constants/purchase";

type ICreatePaymentIntentInput = {
  purchaseType: IPurchaseType;
};

export const createPaymentIntent = async (
  props: ICreatePaymentIntentInput
): Promise<ICreatePaymentIntent> => {
  switch (props.purchaseType) {
    case "increase-photos":
      return api.post(`/payments/create-payment-intent/increase-photos`);
    case "unlimited-votes":
      return api.post(`/payments/create-payment-intent/unlimited-votes`);
    case "unlimited-stats":
      return api.post(`/payments/create-payment-intent/unlimited-stats`);
    default:
      throw new Error("Invalid path");
  }
};
