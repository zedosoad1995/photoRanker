import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

const stripePromise = loadStripe("your_publishable_key");

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {}, []);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("Payment successful!", paymentIntent);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <CardElement />
      <button type="submit" disabled={!stripe} onClick={handleSubmit}>
        Pay
      </button>
    </Elements>
  );
};
