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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const createIntent = async () => {
    setIsLoading(true);
    setHasError(false);
    await createPaymentIntent(purchaseType)
      .then(({ clientSecret }) => {
        setHasError(false);
        setClientSecret(clientSecret);
      })
      .catch(() => {
        setHasError(true);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const stopIntent = () => {
    setClientSecret(undefined);
  };

  return { clientSecret, createIntent, isLoading, stopIntent, hasError };
};
