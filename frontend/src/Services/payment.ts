import { IPurchaseType } from "@shared/constants/purchase";
import { ICreatePaymentIntent } from "@/Types/payment";
import api from ".";

export const createPaymentIntent = async (
  purchaseType: IPurchaseType
): Promise<ICreatePaymentIntent> => {
  return api.post(`/payments/create-payment-intent`, { purchaseType });
};
