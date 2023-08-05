import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cropper, { Area } from "react-easy-crop";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import { AGE_OPTIONS } from "@/constants/user";
import { getLoggedUser } from "@/Utils/user";
import { calculateAge } from "@/Utils/date";
import { getCroppedImage, resizeImage } from "@/Utils/image";
import { uploadImage } from "@/Services/picture";
import { IMAGE_SIZE_LIMIT } from "@/Constants/picture";
import { MIN_AGE } from "../../../../backend/src/constants/user";

interface IUploadPhotoModal {
  image: { image: string; width: number; height: number } | null;
  filename: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
}

export default function UploadPhotoModal({
  image,
  filename,
  isOpen,
  onClose: handleClose,
  onUpload: handleUploadParent,
}: IUploadPhotoModal) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [age, setAge] = useState(() => {
    const user = getLoggedUser();
    if (!user?.dateOfBirth) return String(MIN_AGE);

    return calculateAge(user.dateOfBirth).toString();
  });

  const handleUpload = async () => {
    if (image && filename && croppedAreaPixels) {
      let croppedImage = await getCroppedImage(image.image, croppedAreaPixels);

      if (croppedImage.size > IMAGE_SIZE_LIMIT) {
        croppedImage = await resizeImage(croppedImage);
      }

      await uploadImage(croppedImage, filename);
      handleUploadParent();
      handleClose();
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleCompleteCrop = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex items-center justify-center"
      open={isOpen}
      onClose={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 cursor-pointer" />
      <Dialog.Panel className="bg-white p-6 !pb-10 w-[500px] rounded-xl z-10">
        <div className="font-bold text-center text-lg">Adjust Photo</div>
        <div className="w-[350px] mx-auto">
          <div className="relative w-[350px] h-[350px] mx-auto mt-8">
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
          <div className="mb-6">
            <Select label="Age" options={AGE_OPTIONS} value={age} onChange={setAge} />
          </div>
          <div className="mb-2">
            <Button onClick={handleUpload}>Create</Button>
          </div>
          <Button onClick={handleClose} style="none">
            Cancel
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
