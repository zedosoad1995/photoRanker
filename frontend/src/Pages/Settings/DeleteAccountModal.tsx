import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";

interface IDeleteAccountModal {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export default function DeleteAccountModal({
  isOpen,
  onClose: handleClose,
  onDelete: handleDelete,
}: IDeleteAccountModal) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteCustom = async () => {
    try {
      setIsDeleteLoading(true);
      await handleDelete();
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-10">
        <div className="font-bold text-lg">Delete Account</div>
        <div className="mt-4">
          Are you sure you want to <b className="font-bold">permanently</b> delete your account?
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClose} isFull={false} style="none">
            Cancel
          </Button>
          <Button
            style="danger"
            onClick={handleDeleteCustom}
            isFull={false}
            isLoading={isDeleteLoading}
          >
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
