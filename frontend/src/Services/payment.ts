import { ICreatePaymentIntent } from "@/Types/payment";
import api from ".";

export const createPaymentIntent = async (amount: number): Promise<ICreatePaymentIntent> => {
  return api.post(`/payments/create-payment-intent`, { amount });
};
