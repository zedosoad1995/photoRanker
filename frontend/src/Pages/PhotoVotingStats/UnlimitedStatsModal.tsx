import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { usePaymentIntent } from "@/Hooks/usePaymentIntent";
import Payment from "@/Components/Payment";
import { UNLIMITED_STATS_ON } from "@shared/constants/purchase";
import { StatsIcon } from "@/Components/Icons/Stats";

interface IUnlimitedStatsModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnlimitedStatsModal({
  isOpen,
  onClose: handleClose,
}: IUnlimitedStatsModal) {
  if (!isOpen || !UNLIMITED_STATS_ON) return null;

  const [isPaymentElementLoading, setIsPaymentElementLoading] = useState(false);

  const {
    clientSecret,
    createIntent,
    stopIntent,
    isLoading: isLoadingPaymentIntent,
    hasError,
  } = usePaymentIntent({
    purchaseType: "unlimited-stats",
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
        <div className="font-bold text-center text-xl mb-2">See All Vote Stats</div>
        {!showPayment && (
          <div className="w-full min-[390px]:w-[90%] text-sm min-[370px]:text-base mx-auto text-center">
            <div className="m-auto w-[100%] rounded-full p-4">
              <StatsIcon />
            </div>
            <div className="mt-2">Unlock all your vote's stats.</div>
            <div className="mb-6">
              Including the oponent pic, and voter info (Age, Gender, Country and Ethnicity)
            </div>
            <div className="mb-2">
              <Button isLoading={isLoading} onClick={handleClickPay} variant="outline">
                Unlock vote stats $2.99
              </Button>
            </div>
            <div className="mb-2">
              <Button>See premium (includes stats)</Button>
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
