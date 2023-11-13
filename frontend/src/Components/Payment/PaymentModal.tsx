import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "@/Services/payment";
import { PaymentCheckout } from "./PaymentCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IPaymentModal {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ amount, isOpen, onClose: handleClose }: IPaymentModal) {
  const [clientSecret, setClientSecret] = useState<string>();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    createPaymentIntent("unlimited-votes-all").then(({ clientSecret }) => {
      setClientSecret(clientSecret);
    });
  }, [isOpen]);

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-30">
        <div className="font-bold text-lg mb-4">Pay it now, Habibi</div>
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentCheckout amount={amount} onClose={handleClose} />
          </Elements>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
