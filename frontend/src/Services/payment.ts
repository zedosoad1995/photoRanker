import { IPurchaseType } from "@shared/constants/purchase";
import { ICreatePaymentIntent } from "@/Types/payment";
import api from ".";

export const createPaymentIntent = async (
  purchaseType: IPurchaseType
): Promise<ICreatePaymentIntent> => {
  switch (purchaseType) {
    case "increase-photos":
      return api.post(`/payments/create-payment-intent/increase-photos`);
      break;
    case "unlimited-votes-all":
      return api.post(`/payments/create-payment-intent/unlimited-votes`);
      break;
    case "unlimited-votes-multiple":
      return api.post(`/payments/create-payment-intent/multiple-unlimited-votes`);
      break;
    default:
      throw new Error("Invalid path");
  }
};
