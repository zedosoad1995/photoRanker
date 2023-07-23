import Button from "@/Components/Button";
import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { IPicture } from "../../../../backend/src/types/picture";
import { MIN_HEIGHT, MIN_WIDTH } from "../../../../backend/src/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";

export default function MyPhotos() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [pics, setPics] = useState<string[]>([]);
  const [picsInfo, setPicsInfo] = useState<IPicture[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const getPictures = () => {
    return getManyPictures().then(async (res) => {
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
  };

  useEffect(() => {
    getPictures();
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
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        let base64Image = reader.result as string;

        const { height, width } = await getImageDimensionsFromBase64(base64Image);

        if (height < MIN_HEIGHT || width < MIN_WIDTH) {
          return;
        }

        setSelectedImage(base64Image);
        setFilename(selectedFile.name);
        setIsOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <UploadPhotoModal
        image={selectedImage}
        filename={filename}
        isOpen={isOpen}
        onUpload={getPictures}
        onClose={() => {
          setIsOpen(false);
        }}
      />
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
                <img className="mx-auto w-full" src={pic} alt={`picture-${index}`} />
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
