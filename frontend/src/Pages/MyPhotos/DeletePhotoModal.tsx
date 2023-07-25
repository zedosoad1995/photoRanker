import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";

interface IDeletePhotoModal {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeletePhotoModal({
  isOpen,
  onClose: handleClose,
  onDelete: handleDelete,
}: IDeletePhotoModal) {
  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center mx-5"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 w-[500px] rounded-xl z-10">
        <div className="font-bold text-lg">Delete Photo</div>
        <div className="mt-4">Are you sure you want to delete this photo?</div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClose} isFull={false} style="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} isFull={false}>
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
