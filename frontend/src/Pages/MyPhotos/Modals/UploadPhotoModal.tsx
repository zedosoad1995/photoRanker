import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cropper, { Area } from "react-easy-crop";
import Button from "@/Components/Button";
import { getCroppedImage, resizeImage } from "@/Utils/image";
import { uploadImage } from "@/Services/picture";
import { IMAGE_SIZE_LIMIT } from "@/Constants/picture";
import { IMode, Mode } from "@/Constants/mode";

interface IUploadPhotoModal {
  image: { image: string; width: number; height: number } | null;
  filename: string | null;
  isOpen: boolean;
  mode: IMode;
  onClose: () => void;
  onUpload: () => Promise<void>;
}

export default function UploadPhotoModal({
  image,
  filename,
  isOpen,
  mode,
  onClose: handleClose,
  onUpload: handleUploadParent,
}: IUploadPhotoModal) {
  if (!isOpen) return null;

  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleUpload = async () => {
    if (image && filename && croppedAreaPixels) {
      try {
        setIsUploadLoading(true);
        let croppedImage = await getCroppedImage(image.image, croppedAreaPixels);

        if (croppedImage.size > IMAGE_SIZE_LIMIT) {
          croppedImage = await resizeImage(croppedImage);
        }

        const isGlobal = mode === Mode.Global ? true : false;

        await uploadImage(croppedImage, filename, isGlobal);
        await handleUploadParent();

        handleClose();
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      } finally {
        setIsUploadLoading(false);
      }
    }
  };

  const handleCompleteCrop = (_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center z-50"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white mx-2 p-6 w-[380px] rounded-xl z-30 max-h-[100vh] overflow-y-auto">
        <div className="font-bold text-center text-lg">Adjust Photo</div>
        <div className="w-[80%] mx-auto">
          <div className="relative w-full aspect-square mx-auto mt-8">
            {image && (
              <Cropper
                image={image.image}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCompleteCrop}
                aspect={1}
                objectFit={image.height > image.width ? "vertical-cover" : "horizontal-cover"}
              />
            )}
          </div>
          <div className="mb-4 mt-1">
            <input
              type="range"
              min="1"
              max="3"
              step="0.001"
              value={zoom}
              onChange={(event) => {
                setZoom(Number(event.currentTarget.value));
              }}
              className="bg-gray-200 rounded-lg appearance-none cursor-pointer  w-full h-1"
            />
          </div>
          <div className="mb-2">
            <Button onClick={handleUpload} isLoading={isUploadLoading}>
              Upload
            </Button>
          </div>
          <Button onClick={handleClose} style="none">
            Cancel
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
