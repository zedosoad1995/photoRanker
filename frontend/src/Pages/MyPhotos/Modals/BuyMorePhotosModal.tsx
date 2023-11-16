import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { PhotoIcon } from "@heroicons/react/20/solid";

interface IBuyMorePhotosModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyMorePhotosModal({ isOpen, onClose: handleClose }: IBuyMorePhotosModal) {
  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white mx-2 p-6 w-[380px] rounded-xl z-30 max-h-[100vh] overflow-y-auto">
        <div className="font-bold text-center text-lg">Get More Photos</div>
        <div className="w-[85%] mx-auto text-center mt-4">
          <div className="bg-yellow-200 rounded-full">
            <PhotoIcon className="scale-75" />
          </div>
          <div className="mt-4">Limit of 20 photos reached.</div>
          <div className="mb-8">
            Upgrade for up to <b>100 photos</b>!
          </div>
          <div className="mb-2">
            <Button>Upgrade for $4.99</Button>
          </div>
          <Button style="none">Not Now</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
