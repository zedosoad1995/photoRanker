import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentCheckout } from "./PaymentCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IPayment {
  clientSecret?: string;
  onStripeReady: () => void;
  display?: boolean;
}

export default function Payment({ clientSecret, onStripeReady, display = false }: IPayment) {
  return (
    <div className={display ? "block" : "hidden"}>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentCheckout onStripeReady={onStripeReady} />
        </Elements>
      )}
    </div>
  );
}
