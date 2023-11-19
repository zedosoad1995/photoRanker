import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentCheckout } from "./PaymentCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IPayment {
  clientSecret?: string;
}

export default function Payment({ clientSecret }: IPayment) {
  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentCheckout />
        </Elements>
      )}
    </>
  );
}
