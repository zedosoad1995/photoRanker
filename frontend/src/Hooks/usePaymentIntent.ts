import { useState } from "react";
import { createPaymentIntent } from "@/Services/payment";
import { PURCHASE_TYPE } from "@shared/constants/purchase";
import { toast } from "react-hot-toast";

type IUsePaymentIntent =
  | {
      purchaseType:
        | typeof PURCHASE_TYPE.INCREASE_PHOTOS
        | typeof PURCHASE_TYPE.UNLIMITED_VOTES_ALL
        | typeof PURCHASE_TYPE.UNLIMITED_STATS;
      errorMessage?: string;
    }
  | {
      purchaseType: typeof PURCHASE_TYPE.UNLIMITED_VOTES_MULTIPLE;
      pictureIds: string[];
      errorMessage?: string;
    };

export const usePaymentIntent = ({
  errorMessage = "Unable to upgrade. Please try again later.",
  ...props
}: IUsePaymentIntent) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const createIntent = async () => {
    setIsLoading(true);
    setHasError(false);
    await createPaymentIntent(props)
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
