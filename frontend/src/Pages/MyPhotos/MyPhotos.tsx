import Button from "@/Components/Button";
import { getManyPictures } from "@/Services/picture";
import { useCallback, useEffect, useRef, useState } from "react";
import { LIMIT_PICTURES, MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import DeletePhotoModal from "./DeletePhotoModal";
import { toast } from "react-hot-toast";
import { IPictureWithPercentile } from "@/Types/picture";
import { isAdmin } from "@/Utils/role";
import BanUserModal from "./BanUserModal";
import { useAuth } from "@/Contexts/auth";
import { Spinner } from "@/Components/Loading/Spinner";
import { PhotoCard } from "./ImageCard";
import usePrevious from "@/Hooks/usePrevious";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import Filters from "./Filters/Filters";
import { debounce } from "underscore";

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
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [nextCursor, setNextCursor] = useState<string>();
  const prevCursor = usePrevious(nextCursor);

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
  const [genderOption, setGenderOption] = useState<string>();
  const [minAge, setMinAge] = useState<number>();
  const [maxAge, setMaxAge] = useState<number>();

  const getPictures = async (cursor?: string) => {
    try {
      if (!loggedUser) return;

      isLoadingPageRef.current = true;

      const orderByKey = sortValue.split(" ")[0];
      const orderByDir = sortValue.split(" ")[1];

      const res = await getManyPictures({
        ...(isAdmin(loggedUser.role) ? {} : { userId: loggedUser.id }),
        ...(filterSelectedOption ? { [filterSelectedOption]: true } : {}),
        gender: genderOption,
        orderBy: orderByKey,
        minAge,
        maxAge,
        orderByDir,
        limit: 30,
        cursor,
      }).then(async (res) => {
        setNextCursor(res.nextCursor);

        setPics((val) =>
          cursor
            ? [...new Set([...val, ...res.pictures.map(({ url }) => url)])]
            : res.pictures.map(({ url }) => url)
        );
        setPicsInfo((val) => {
          return cursor
            ? [
                ...new Set([
                  ...val.map((row) => JSON.stringify(row)),
                  ...res.pictures.map((pic) => JSON.stringify(pic)),
                ]),
              ].map((row) => JSON.parse(row))
            : res.pictures.map((pic) => pic);
        });

        if (!areTherePictures) setAreThePictures(pics.length > 0);
      });

      return res;
    } finally {
      setIsLoading(false);
      setIsFetchingFilter(false);
      isLoadingPageRef.current = false;
      setIsLoadingPage(false);
    }
  };

  const handleScrollUpdate = () => {
    if (nextCursor) {
      isLoadingPageRef.current = true;
      setIsLoadingPage(true);
      getPictures(nextCursor);
    }
  };

  useInfiniteScroll({ isLoading: isLoadingPageRef.current, onUpdate: handleScrollUpdate }, [
    nextCursor,
  ]);

  useEffect(() => {
    getPictures();
  }, [sortValue, filterSelectedOption, genderOption, minAge, maxAge]);

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

  const handleGenderSelect = (selectedOption: string) => {
    setIsFetchingFilter(true);
    setGenderOption((val) => {
      if (val === selectedOption) {
        return "";
      }

      return selectedOption;
    });
  };

  const debouncedUpdateAgeRange = useCallback(
    debounce((minAge: number, maxAge: number) => {
      setIsFetchingFilter(true);
      setMaxAge(maxAge);
      setMinAge(minAge);
    }, 400),
    []
  );

  const updatePicturesAfterDelete = () => {
    return getPictures(prevCursor);
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
        getPictures={updatePicturesAfterDelete}
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
      <div className="pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
        {!isLoading && pics.length === 0 && !areTherePictures && <EmptyPlaceholder />}
        {loggedUser && !isLoading && (pics.length > 0 || areTherePictures) && (
          <>
            <input
              type="file"
              accept="image/jpeg, image/png"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className={`flex gap-4 flex-col ${
                isAdmin(loggedUser.role) ? "lg:flex-row" : "min-[330px]:flex-row"
              }`}
            >
              <div className="w-full sm:w-fit">
                <Button
                  disabled={hasReachedPicsLimit}
                  onClick={handleFileSelect}
                  isFull={true}
                  isHeightFull={true}
                >
                  <span className="mr-3 text-xl !leading-5">+</span>
                  <span>Add Photo</span>
                </Button>
              </div>
              <Filters
                isAdmin={isAdmin(loggedUser.role)}
                filterSelectedOption={filterSelectedOption}
                handleFilterSelect={handleFilterSelect}
                sortValue={sortValue}
                handleSortSelect={handleSortSelect}
                genderOption={genderOption}
                handleGenderSelect={handleGenderSelect}
                updateAgeRange={debouncedUpdateAgeRange}
              />
            </div>
            <div className="-mx-3 mt-1 flow-root relative">
              <div
                className={`bg-white absolute w-full h-full z-10 transition-opacity delay-200 ${
                  isFetchingFilter ? "block opacity-70" : "hidden opacity-0"
                }`}
              />
              <div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-0 delay-200 ${
                  isFetchingFilter ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <Spinner />
              </div>
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
      {isLoadingPage && <Spinner />}
    </>
  );
}
