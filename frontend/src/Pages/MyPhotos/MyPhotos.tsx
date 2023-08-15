import Button from "@/Components/Button";
import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { LIMIT_PICTURES, MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/20/solid";
import DeletePhotoModal from "./DeletePhotoModal";
import { toast } from "react-hot-toast";
import { IPictureWithPercentile } from "@/Types/picture";
import { isAdmin, isRegular } from "@/Utils/role";
import Menu from "@/Components/Menu";
import BanUserModal from "./BanUserModal";
import Select from "@/Components/Select";
import { useAuth } from "@/Contexts/auth";

const DEFAULT_SORT = "score desc";

export default function MyPhotos() {
  const { user: loggedUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    width: number;
    height: number;
  } | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [pics, setPics] = useState<string[]>([]);
  const [picsInfo, setPicsInfo] = useState<IPictureWithPercentile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [areTherePictures, setAreThePictures] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [picToDeleteIndex, setPicToDeleteIndex] = useState<number | null>(null);
  const [isOpenBan, setIsOpenBan] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState<string | null>(null);

  const hasReachedPicsLimit = pics.length >= LIMIT_PICTURES && loggedUser?.role == "REGULAR";

  const [filterSelectedOption, setFilterSelectedOption] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>(DEFAULT_SORT);

  const getPictures = () => {
    if (!loggedUser) return;

    const orderByKey = sortValue.split(" ")[0];
    const orderByDir = sortValue.split(" ")[1];

    return getManyPictures({
      ...(isAdmin(loggedUser.role) ? {} : { userId: loggedUser.id }),
      ...(filterSelectedOption ? { [filterSelectedOption]: true } : {}),
      orderBy: orderByKey,
      orderByDir,
    })
      .then(async (res) => {
        const resPics = await Promise.allSettled(
          res.pictures.map(async (pic) => {
            const { url } = await getImage(pic.filepath);
            return { url, pic };
          })
        );

        const successfulPics = resPics
          .filter(
            (res): res is PromiseFulfilledResult<{ url: string; pic: IPictureWithPercentile }> =>
              res.status === "fulfilled"
          )
          .map((res) => res.value);

        setPics(successfulPics.map(({ url }) => url));
        setPicsInfo(successfulPics.map(({ pic }) => pic));

        if (!areTherePictures) setAreThePictures(pics.length > 0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPictures();
  }, [sortValue, filterSelectedOption]);

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

  const handleClickDeletePic = (index: number) => async (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsOpenDelete(true);
    setPicToDeleteIndex(index);
  };

  const handleClickBanUser = (index: number) => async (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsOpenBan(true);
    setUserIdToBan(picsInfo[index].userId);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDelete(false);
  };

  const handleCloseBanModal = () => {
    setIsOpenBan(false);
  };

  const handleFilterSelect = (selectedOption: string) => {
    setFilterSelectedOption((val) => {
      if (val === selectedOption) {
        return "";
      }

      return selectedOption;
    });
  };

  const handleSortSelect = (selectedOption: string) => {
    const orderByKey = selectedOption.split(" ")[0];

    if (orderByKey === "reportedDate") {
      setFilterSelectedOption("hasReport");
    }

    setSortValue(selectedOption);
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
      <BanUserModal
        isOpen={isOpenBan}
        onClose={handleCloseBanModal}
        userIdToBan={userIdToBan}
        getPictures={getPictures}
      />
      <DeletePhotoModal
        isOpen={isOpenDelete}
        picToDeleteIndex={picToDeleteIndex}
        onClose={handleCloseDeleteModal}
        getPictures={getPictures}
        picsInfo={picsInfo}
        setPics={setPics}
        setPicsInfo={setPicsInfo}
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
        {!isLoading && pics.length === 0 && !areTherePictures && <EmptyPlaceholder />}
        {loggedUser && !isLoading && (pics.length > 0 || areTherePictures) && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className={`${
                isAdmin(loggedUser.role) ? "min-[520px]:flex" : "min-[330px]:flex"
              } gap-4`}
            >
              <Button disabled={hasReachedPicsLimit} onClick={handleFileSelect} isFull={false}>
                <span className="mr-3 text-xl !leading-5">+</span>
                <span>Add Photo</span>
              </Button>
              <div
                className={`${
                  isAdmin(loggedUser.role) ? "max-[520px]:mt-4" : "max-[330px]:mt-4"
                } flex gap-4`}
              >
                {isAdmin(loggedUser.role) && (
                  <div
                    className={`${
                      isAdmin(loggedUser.role) ? "min-[520px]:w-40" : "min-[330px]:w-40"
                    } w-full`}
                  >
                    <Select
                      onChange={handleFilterSelect}
                      options={[
                        { id: "belongsToMe", label: "My Pictures" },
                        { id: "hasReport", label: "Reported Pictures" },
                        { id: "isBanned", label: "Banned Users" },
                      ]}
                      value={filterSelectedOption}
                      title="Filters"
                    />
                  </div>
                )}
                <div
                  className={`${
                    isAdmin(loggedUser.role) ? "min-[520px]:w-40" : "min-[330px]:w-40"
                  } w-full`}
                >
                  <Select
                    onChange={handleSortSelect}
                    options={[
                      { id: DEFAULT_SORT, label: "Score Highest to Lowest" },
                      { id: "score asc", label: "Score Lowest to Highest" },
                      { id: "numVotes desc", label: "Votes Highest to Lowest" },
                      { id: "numVotes asc", label: "Votes Lowest to Highest" },
                      { id: "createdAt desc", label: "Creation Date Highest to Lowest" },
                      { id: "createdAt asc", label: "Creation Date Lowest to Highest" },
                      ...(isAdmin(loggedUser.role)
                        ? [
                            { id: "reportedDate desc", label: "Reported Date Highest to Lowest" },
                            { id: "reportedDate asc", label: "Reported Date Lowest to Highest" },
                          ]
                        : []),
                    ]}
                    value={sortValue}
                    title="Sort"
                  />
                </div>
              </div>
            </div>
            <div className="-mx-3 mt-1">
              {pics.map((pic, index) => (
                <div key={pic} className="w-1/2 md:w-1/3 lg:w-1/4 float-left p-3">
                  <div className="cursor-pointer rounded-b-md shadow-md">
                    <div className="relative">
                      {loggedUser && isAdmin(loggedUser.role) && (
                        <div className="absolute right-[2%] top-[2%] origin-top-right">
                          <Menu
                            items={[
                              {
                                label: "Delete Photo",
                                onClick: handleClickDeletePic(index),
                              },
                              {
                                label: "Ban User",
                                onClick: handleClickBanUser(index),
                                disabled: loggedUser.id === picsInfo[index].userId,
                              },
                            ]}
                          >
                            <EllipsisVerticalIcon className="p-[2px] h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200" />
                          </Menu>
                        </div>
                      )}
                      {loggedUser && isRegular(loggedUser.role) && (
                        <XMarkIcon
                          onClick={handleClickDeletePic(index)}
                          className="absolute right-[2%] top-[2%] origin-top-right h-5 w-5 cursor-pointer rounded-full bg-white bg-opacity-30 hover:bg-opacity-60 transition duration-200"
                        />
                      )}
                      <div className="rounded-t-md overflow-hidden">
                        <img className="mx-auto w-full" src={pic} alt={`picture-${index}`} />
                      </div>
                    </div>
                    <div className="p-3 font-semibold text-sm">
                      <div>
                        score:{" "}
                        {picsInfo[index].numVotes > 0
                          ? (picsInfo[index].percentile / 10).toFixed(1)
                          : "-"}
                      </div>
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
