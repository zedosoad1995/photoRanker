import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { CameraRollIcon } from "@/Components/Icons/CameraRoll";
import { usePaymentIntent } from "@/Hooks/usePaymentIntent";
import Payment from "@/Components/Payment";
import { MAX_FREE_PHOTOS, MAX_PAID_PHOTOS } from "@shared/constants/purchase";

interface IBuyMorePhotosModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyMorePhotosModal({ isOpen, onClose: handleClose }: IBuyMorePhotosModal) {
  const [isPaymentElementLoading, setIsPaymentElementLoading] = useState(false);

  const {
    clientSecret,
    createIntent,
    stopIntent,
    isLoading: isLoadingPaymentIntent,
    hasError,
  } = usePaymentIntent({
    purchaseType: "increase-photos",
  });

  const isLoading = isLoadingPaymentIntent || isPaymentElementLoading;
  const showPayment = Boolean(clientSecret) && !isLoading;

  useEffect(() => {
    if (isLoadingPaymentIntent) {
      setIsPaymentElementLoading(true);
    }
  }, [isLoadingPaymentIntent]);

  useEffect(() => {
    if (hasError) {
      setIsPaymentElementLoading(false);
    }
  }, [hasError]);

  const handleStripeReady = () => {
    setIsPaymentElementLoading(false);
  };

  const handleClickPay = () => {
    createIntent();
  };

  const onCloseModal = () => {
    stopIntent();
    handleClose();
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center z-50"
      open={isOpen}
      onClose={onCloseModal}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white mx-2 p-6 w-[380px] rounded-xl z-30 max-h-[100vh] overflow-y-auto">
        <div className="font-bold text-center text-xl mb-4">Get More Photos</div>
        {!showPayment && (
          <div className="w-[90%] mx-auto text-center">
            <div className="m-auto w-[80%] rounded-full bg-[#fa8072] p-4">
              <CameraRollIcon />
            </div>
            <div className="mt-4">Limit of {MAX_FREE_PHOTOS} photos reached.</div>
            <div className="mb-8">
              Upgrade for up to <b>{MAX_PAID_PHOTOS} photos</b>!
            </div>
            <div className="mb-2">
              <Button isLoading={isLoading} onClick={handleClickPay}>
                Upgrade for $4.99
              </Button>
            </div>
            <Button onClick={onCloseModal} style="none">
              Not Now
            </Button>
          </div>
        )}
        <Payment
          clientSecret={clientSecret}
          onStripeReady={handleStripeReady}
          display={showPayment}
          onSuccess={onCloseModal}
        />
      </Dialog.Panel>
    </Dialog>
  );
}
