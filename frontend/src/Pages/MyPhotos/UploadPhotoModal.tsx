import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cropper, { Area } from "react-easy-crop";
import Button from "@/Components/Button";
import Select from "@/Components/Select";
import { AGE_OPTIONS } from "@/constants/user";
import { getUser } from "@/Utils/user";
import { calculateAge } from "@/Utils/date";
import { getCroppedImage, resizeImage } from "@/Utils/dataManipulation";
import { uploadImage } from "@/Services/picture";
import { IMAGE_SIZE_LIMIT } from "@/constants/picture";

interface IUploadPhotoModal {
  image: string | null;
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
    const user = getUser();
    if (!user?.dateOfBirth) return "18";

    return calculateAge(user.dateOfBirth).toString();
  });

  const handleUpload = async () => {
    if (image && filename && croppedAreaPixels) {
      let croppedImage = await getCroppedImage(image, croppedAreaPixels);

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
                image={image}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCompleteCrop}
                aspect={1}
                objectFit="horizontal-cover"
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
          <Button onClick={handleClose} style="secondary">
            Cancel
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
