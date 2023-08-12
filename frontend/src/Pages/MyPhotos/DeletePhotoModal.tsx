import { Dialog } from "@headlessui/react";
import Button from "@/Components/Button";
import { deleteImage } from "@/Services/picture";
import { IPictureWithPercentile } from "@/Types/picture";

interface IDeletePhotoModal {
  isOpen: boolean;
  onClose: () => void;
  picToDeleteIndex: number | null;
  setPics: React.Dispatch<React.SetStateAction<string[]>>;
  setPicsInfo: React.Dispatch<React.SetStateAction<IPictureWithPercentile[]>>;
  picsInfo: IPictureWithPercentile[];
  getPictures: () => Promise<void> | undefined;
}

export default function DeletePhotoModal({
  isOpen,
  onClose: handleClose,
  picToDeleteIndex,
  setPics,
  setPicsInfo,
  picsInfo,
  getPictures,
}: IDeletePhotoModal) {
  const handleDelete = async () => {
    if (picToDeleteIndex === null) return;

    setPicsInfo((pics) => [
      ...pics.slice(0, picToDeleteIndex),
      ...pics.slice(picToDeleteIndex + 1),
    ]);
    setPics((pics) => [...pics.slice(0, picToDeleteIndex), ...pics.slice(picToDeleteIndex + 1)]);

    handleClose();

    await deleteImage(picsInfo[picToDeleteIndex].id);
    getPictures();
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
        <div className="font-bold text-lg">Delete Photo</div>
        <div className="mt-4">Are you sure you want to delete this photo?</div>
        <div className="flex justify-end gap-2 mt-8">
          <Button onClick={handleClose} isFull={false} style="none">
            Cancel
          </Button>
          <Button onClick={handleDelete} isFull={false} style="danger">
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
