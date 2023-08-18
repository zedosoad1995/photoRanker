import Button from "@/Components/Button";
import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { LIMIT_PICTURES, MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import DeletePhotoModal from "./DeletePhotoModal";
import { toast } from "react-hot-toast";
import { IPictureWithPercentile } from "@/Types/picture";
import { isAdmin } from "@/Utils/role";
import BanUserModal from "./BanUserModal";
import Select from "@/Components/Select";
import { useAuth } from "@/Contexts/auth";
import { useQueryClient } from "react-query";
import { Spinner } from "@/Components/Loading/Spinner";
import { PhotoCard } from "./ImageCard";

const DEFAULT_SORT = "score desc";

export default function MyPhotos() {
  const { user: loggedUser } = useAuth();

  const queryClient = useQueryClient();

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
  const [nextCursor, setNextCursor] = useState<string>();
  const [areTherePictures, setAreThePictures] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [picToDeleteIndex, setPicToDeleteIndex] = useState<number | null>(null);
  const [isOpenBan, setIsOpenBan] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState<string | null>(null);

  const isLoadingPageRef = useRef(false);

  const [isFetchingFilter, setIsFetchingFilter] = useState(false);

  const hasReachedPicsLimit = pics.length >= LIMIT_PICTURES && loggedUser?.role == "REGULAR";

  const [filterSelectedOption, setFilterSelectedOption] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>(DEFAULT_SORT);

  const getPictures = async (cursor?: string) => {
    try {
      if (!loggedUser) return;

      isLoadingPageRef.current = true;

      const orderByKey = sortValue.split(" ")[0];
      const orderByDir = sortValue.split(" ")[1];

      const res = await getManyPictures({
        ...(isAdmin(loggedUser.role) ? {} : { userId: loggedUser.id }),
        ...(filterSelectedOption ? { [filterSelectedOption]: true } : {}),
        orderBy: orderByKey,
        orderByDir,
        limit: 10,
        cursor,
      }).then(async (res) => {
        setNextCursor(res.nextCursor);

        const resPics = await Promise.all(
          res.pictures.map(async (pic) => {
            const { url } = await queryClient.fetchQuery(["getImage", pic.filepath], {
              queryFn: () => getImage(pic.filepath),
              staleTime: Infinity,
            });

            return { url, pic };
          })
        );

        setPics((val) =>
          cursor ? [...val, ...resPics.map(({ url }) => url)] : resPics.map(({ url }) => url)
        );
        setPicsInfo((val) =>
          cursor ? [...val, ...resPics.map(({ pic }) => pic)] : resPics.map(({ pic }) => pic)
        );

        if (!areTherePictures) setAreThePictures(pics.length > 0);
      });

      return res;
    } finally {
      setIsLoading(false);
      setIsFetchingFilter(false);
      isLoadingPageRef.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const THRESHOLD = 50;

      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.scrollHeight - THRESHOLD ||
        isLoadingPageRef.current
      ) {
        return;
      }

      if (nextCursor) {
        isLoadingPageRef.current = true;
        getPictures(nextCursor);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextCursor]);

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
    setIsFetchingFilter(true);
    setFilterSelectedOption((val) => {
      if (val === selectedOption) {
        if (val === "hasReport" && sortValue.includes("reportedDate")) {
          setSortValue(DEFAULT_SORT);
        }

        return "";
      }

      return selectedOption;
    });
  };

  const handleSortSelect = (selectedOption: string) => {
    setIsFetchingFilter(true);
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
      {isLoading && <Spinner />}
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
                {isFetchingFilter && <Spinner />}
              </div>
            </div>
            <div className="-mx-3 mt-1">
              {pics.map((pic, index) => (
                <PhotoCard
                  key={pic}
                  index={index}
                  loggedUser={loggedUser}
                  onClickBanUser={handleClickBanUser(index)}
                  onClickDeletePic={handleClickDeletePic(index)}
                  pic={pic}
                  picInfo={picsInfo[index]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
