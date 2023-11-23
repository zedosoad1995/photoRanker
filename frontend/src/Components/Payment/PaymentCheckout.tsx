import { useEffect, useState } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import Button from "../Button";

interface IPaymentCheckout {
  onStripeReady: () => void;
  onSuccess: () => void;
}

export const PaymentCheckout = ({ onStripeReady, onSuccess }: IPaymentCheckout) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!elements) return;

    const element = elements.getElement("payment");
    if (!element) return;

    element.on("loaderstart", () => {
      onStripeReady();
    });
    element.on("loaderror", () => {
      onStripeReady();
    });
  }, [elements, onStripeReady]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoading(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: import.meta.env.VITE_FRONTEND_URL,
        },
        redirect: "if_required",
      });

      if (error) {
        console.log(error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong with your payment");
        }
      } else if (paymentIntent.status === "succeeded") {
        onSuccess();
        toast.success(
          `Order received, payment is being processed. If nothing happens try reloading or come back later.`,
          {
            duration: 10000,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PaymentElement />
      <div className="flex justify-end mt-4">
        <Button isFull={false} disabled={!stripe} onClick={handleSubmit} isLoading={isLoading}>
          Pay
        </Button>
      </div>
    </>
  );
};
