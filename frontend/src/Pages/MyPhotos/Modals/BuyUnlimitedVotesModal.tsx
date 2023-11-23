import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { usePaymentIntent } from "@/Hooks/usePaymentIntent";
import Payment from "@/Components/Payment";
import { MAX_FREE_VOTES } from "@shared/constants/purchase";
import { UnlockIcon } from "@/Components/Icons/Unlock";

interface IBuyUnlimitedVotesModal {
  pictureId: string;
  currNumVotes: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyUnlimitedVotesModal({
  pictureId,
  currNumVotes,
  isOpen,
  onClose: handleClose,
}: IBuyUnlimitedVotesModal) {
  if (!isOpen) return null;

  const [isPaymentElementLoading, setIsPaymentElementLoading] = useState(false);

  const {
    clientSecret,
    createIntent,
    stopIntent,
    isLoading: isLoadingPaymentIntent,
    hasError,
  } = usePaymentIntent({
    purchaseType: "unlimited-votes-multiple",
    pictureIds: [pictureId],
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
        <div className="font-bold text-center text-xl mb-2">Get Unlimited Votes</div>
        {!showPayment && (
          <div className="w-full min-[390px]:w-[90%] text-sm min-[370px]:text-base mx-auto text-center">
            <div className="m-auto w-[100%] rounded-full p-4">
              <UnlockIcon />
            </div>
            <div className="mt-2">
              Limit of <b className="text-danger">{MAX_FREE_VOTES}</b> votes reached.
            </div>
            <div className="mb-6">
              Upgrade to unlock all <b>{currNumVotes}</b> votes and receive <b>unlimited</b> voting!
            </div>
            <div className="mb-2">
              <Button isLoading={isLoading} onClick={handleClickPay}>
                Unlock this picture for $0.99
              </Button>
            </div>
            <div className="mb-2">
              <Button onClick={handleClickPay} variant="outline">
                Upgrade for any picture
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
