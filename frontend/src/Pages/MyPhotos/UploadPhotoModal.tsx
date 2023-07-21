import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cropper from "react-easy-crop";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import { AGE_OPTIONS } from "@/constants/user";

interface IUploadPhotoModal {
  image: string | null;
  isOpen: boolean;
  handleClose: () => void;
}

export default function UploadPhotoModal({ image, isOpen, handleClose }: IUploadPhotoModal) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 !pb-12 w-[500px] rounded-xl z-10">
        <div className="font-bold text-center text-lg">Adjust Photo</div>
        <div className="w-[350px] mx-auto">
          <div className="relative w-[350px] h-[350px] mx-auto mt-8">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={console.log}
                onZoomChange={setZoom}
                aspect={1}
              />
            )}
          </div>
          <div className="mb-4 mt-1">
            <input
              id="default-range"
              type="range"
              min="1"
              max="3"
              step="0.001"
              value={zoom}
              onChange={(event) => {
                setZoom(Number(event.currentTarget.value));
              }}
              className="bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 w-full h-1"
            />
          </div>
          <div className="flex gap-4 mb-6">
            <Select
              label="Age"
              options={AGE_OPTIONS}
              value="1"
              onChange={(value: string) => {
                console.log(value);
              }}
            />
            <Select
              label="Sex"
              options={["Male", "Female"]}
              value="Female"
              onChange={(value: string) => {
                console.log(value);
              }}
            />
          </div>
          <div className="mb-2">
            <Button>Create</Button>
          </div>
          <Button style="secondary">Cancel</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
