import { useState } from "react";
import { createPaymentIntent } from "@/Services/payment";
import { IPurchaseType } from "@shared/constants/purchase";
import { toast } from "react-hot-toast";

interface IUsePaymentIntent {
  purchaseType: IPurchaseType;
  errorMessage?: string;
}

export const usePaymentIntent = ({
  purchaseType,
  errorMessage = "Unable to upgrade. Please try again later.",
}: IUsePaymentIntent) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isLoadind, setIsLoading] = useState(false);

  const createIntent = async () => {
    setIsLoading(true);
    await createPaymentIntent(purchaseType)
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret);
      })
      .catch(() => {
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { clientSecret, createIntent, isLoadind };
};
