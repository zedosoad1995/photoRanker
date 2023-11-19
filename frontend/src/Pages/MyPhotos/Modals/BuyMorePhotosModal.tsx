import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { CameraRollIcon } from "@/Components/Icons/CameraRoll";

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
        <div className="font-bold text-center text-xl">Get More Photos</div>
        <div className="w-[90%] mx-auto text-center mt-4">
          <div className="m-auto w-[80%] rounded-full bg-[#fa8072] p-4">
            <CameraRollIcon />
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
