import Button from "@/Components/Button";
import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { IPicture } from "../../../backend/src/types/picture";
import { Dialog } from "@headlessui/react";
import Cropper from "react-easy-crop";

export default function MyPhotos() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pics, setPics] = useState<string[]>([]);
  const [picsInfo, setPicsInfo] = useState<IPicture[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getManyPictures().then(async (res) => {
      const pics: string[] = [];
      const picsInfo: IPicture[] = [];
      for (const pic of res.pictures) {
        try {
          const tempPic = await getImage(pic.filepath);
          pics.push(URL.createObjectURL(tempPic));
          picsInfo.push(pic);
        } catch (error) {}
      }
      setPics(pics);
      setPicsInfo(picsInfo);
    });
  }, []);

  useEffect(() => {
    return () => {
      pics.forEach((pic) => {
        URL.revokeObjectURL(pic);
      });
    };
  }, [pics]);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setSelectedImage(reader.result as string);
        setIsOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 flex items-center justify-center"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Panel className="bg-blue-200 p-5 w-[500px] rounded-xl">
          <div className="font-bold text-center text-lg">Adjust Photo</div>
          <div className="relative w-[350px] h-[350px] mx-auto my-8">
            {selectedImage && (
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={console.log}
                onZoomChange={setZoom}
                aspect={1}
              />
            )}
          </div>
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </Dialog.Panel>
      </Dialog>
      <div className="flow-root pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleFileSelect}>
          <span className="mr-3 text-xl !leading-5">+</span>
          <span>Add Photo</span>
        </Button>
        <div className="-mx-3">
          {pics.map((pic, index) => (
            <div key={pic} className="w-1/2 md:w-1/3 lg:w-1/4 float-left p-3">
              <div className="cursor-pointer shadow-md rounded-md overflow-hidden">
                <img className="mx-auto" src={pic} alt={`picture-${index}`} />
                <div className="p-3 font-semibold text-sm">
                  <div>elo: {picsInfo[index].elo}</div>
                  <div>votes: {picsInfo[index].numVotes}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
