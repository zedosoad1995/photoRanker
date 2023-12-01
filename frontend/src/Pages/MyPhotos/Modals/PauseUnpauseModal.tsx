import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { useState } from "react";

interface IPauseUnpauseModal {
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
  onAccepted: () => Promise<void> | undefined;
}

export default function PauseUnpauseModal({
  isOpen,
  isActive,
  onClose: handleClose,
  onAccepted,
}: IPauseUnpauseModal) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);

  const handleAccepted = async () => {
    try {
      setIsLoading(true);
      await onAccepted();

      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5 z-50"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-30">
        <div className="font-bold text-lg">{isActive ? "Pause Voting" : "Activate Photo"}</div>
        <div className="mt-4">
          {isActive
            ? "If you pause, this photo won't get more votes. Are you sure?"
            : "If you activate, this photos you will start getting new votes. Are you sure?"}
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClose} isFull={false} style="none">
            Cancel
          </Button>
          <Button onClick={handleAccepted} isFull={false} style="primary" isLoading={isLoading}>
            {isActive ? "Pause" : "Activate"}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
