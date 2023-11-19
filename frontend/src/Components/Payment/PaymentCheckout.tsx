import { useEffect } from "react";
import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import Button from "../Button";

interface IPaymentCheckout {
  onStripeReady: () => void;
}

export const PaymentCheckout = ({ onStripeReady }: IPaymentCheckout) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!elements) return;

    const element = elements.getElement("payment");
    if (!element) return;

    element.on("loaderstart", () => {
      onStripeReady();
    });
  }, [elements, onStripeReady]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

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
      toast.success(`Payment complete!`);
    }
  };

  return (
    <>
      <PaymentElement />
      <div className="flex justify-end mt-3">
        <Button isFull={false} disabled={!stripe} onClick={handleSubmit}>
          Pay
        </Button>
      </div>
    </>
  );
};
