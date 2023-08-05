import Button from "@/Components/Button";
import { deleteImage, getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useMemo, useRef, useState } from "react";
import { IPicture } from "../../../../backend/src/types/picture";
import { LIMIT_PICTURES, MIN_HEIGHT, MIN_WIDTH } from "../../../../backend/src/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import DeletePhotoModal from "./DeletePhotoModal";
import { getLoggedUser } from "@/Utils/user";
import { toast } from "react-hot-toast";

export default function MyPhotos() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    width: number;
    height: number;
  } | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [pics, setPics] = useState<string[]>([]);
  const [picsInfo, setPicsInfo] = useState<IPicture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [picToDeleteIndex, setPicToDeleteIndex] = useState<number | null>(null);

  const loggedUser = useMemo(() => getLoggedUser(), []);
  const hasReachedPicsLimit = pics.length >= LIMIT_PICTURES && loggedUser?.role == "REGULAR";

  const getPictures = () => {
    return getManyPictures(loggedUser?.id)
      .then(async (res) => {
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
      })
      .finally(() => {
        setIsLoading(false);
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

  const handlePictureUpload = async () => {
    await getPictures();
  };

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
          toast.error(`Picture must be at least ${MIN_WIDTH}x${MIN_HEIGHT}`, {
            id: "image-too-small",
          });
          return;
        }

        setSelectedImage({ image: base64Image, height, width });
        setFilename(selectedFile.name);
        setIsOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClickDeletePic =
    (index: number) => async (event: React.MouseEvent<SVGSVGElement>) => {
      event.stopPropagation();

      setIsOpenDelete(true);
      setPicToDeleteIndex(index);
    };

  const handleDeletePic = async () => {
    if (picToDeleteIndex != null) {
      setPicsInfo((pics) => [
        ...pics.slice(0, picToDeleteIndex),
        ...pics.slice(picToDeleteIndex + 1),
      ]);
      setPics((pics) => [...pics.slice(0, picToDeleteIndex), ...pics.slice(picToDeleteIndex + 1)]);

      handleCloseDeleteModal();

      await deleteImage(picsInfo[picToDeleteIndex].id);
      getPictures();
    }
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDelete(false);
  };

  const EmptyPlaceholder = () => {
    return (
      <div className="flex flex-col items-center">
        <ArrowUpTrayIcon className="w-28 h-28" />
        <div className="text-xl font-bold mt-4">Upload Photo</div>
        <div className="mt-2 mb-8 text-center">
          You currently have no photos.
          <br />
          Add you first photo to start receiving votes!
        </div>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleFileSelect} isFull={false}>
          <span className="mr-3 text-xl !leading-5">+</span>
          <span>Add Photo</span>
        </Button>
      </div>
    );
  };

  return (
    <>
      <DeletePhotoModal
        isOpen={isOpenDelete}
        onDelete={handleDeletePic}
        onClose={handleCloseDeleteModal}
      />
      <UploadPhotoModal
        image={selectedImage}
        filename={filename}
        isOpen={isOpen}
        onUpload={handlePictureUpload}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="flow-root pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
        {!isLoading && pics.length === 0 && <EmptyPlaceholder />}
        {!isLoading && pics.length > 0 && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button disabled={hasReachedPicsLimit} onClick={handleFileSelect} isFull={false}>
              <span className="mr-3 text-xl !leading-5">+</span>
              <span>Add Photo</span>
            </Button>
            <div className="-mx-3">
              {pics.map((pic, index) => (
                <div key={pic} className="w-1/2 md:w-1/3 lg:w-1/4 float-left p-3">
                  <div className="cursor-pointer shadow-md rounded-md overflow-hidden">
                    <div className="relative">
                      <XMarkIcon
                        onClick={handleClickDeletePic(index)}
                        className="absolute right-[2%] top-[2%] origin-top-right h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200"
                      />
                      <img className="mx-auto w-full" src={pic} alt={`picture-${index}`} />
                    </div>
                    <div className="p-3 font-semibold text-sm">
                      <div>elo: {picsInfo[index].elo}</div>
                      <div>votes: {picsInfo[index].numVotes}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
