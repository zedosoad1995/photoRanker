import Button from "@/Components/Button";
import { getManyPictures, getUploadPermission } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import { IPictureWithPercentile } from "@/Types/picture";
import { isAdmin } from "@/Utils/role";
import { useAuth } from "@/Contexts/auth";
import { Spinner } from "@/Components/Loading/Spinner";
import usePrevious from "@/Hooks/usePrevious";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { PhotosGird } from "./PhotosGrid";
import { Header } from "./Header";
import UploadPhotoModal from "./UploadPhotoModal";
import { Mode } from "@/Constants/mode";

const DEFAULT_SORT = "score desc";

interface IPersonalMode {
  picUrls: string[];
  setPicUrls: React.Dispatch<React.SetStateAction<string[]>>;
  nextCursor: string | undefined;
  setNextCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
  picsInfo: IPictureWithPercentile[];
  setPicsInfo: React.Dispatch<React.SetStateAction<IPictureWithPercentile[]>>;
  isSet: boolean;
  setIsSet: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PersonalMode({
  picUrls,
  setPicUrls,
  nextCursor,
  setNextCursor,
  picsInfo,
  setPicsInfo,
  isSet,
  setIsSet,
}: IPersonalMode) {
  const { user: loggedUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    width: number;
    height: number;
  } | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!isSet);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const prevCursor = usePrevious(nextCursor);

  const [areTherePictures, setAreThePictures] = useState(false);
  const [hasReachedPicsLimit, setHasReachedPicsLimit] = useState(false);

  const isLoadingPageRef = useRef(false);
  const [isFetchingFilter, setIsFetchingFilter] = useState(false);

  const [filterSelectedOption, setFilterSelectedOption] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>(DEFAULT_SORT);
  const [genderOption, setGenderOption] = useState<string>();
  const [minAge, setMinAge] = useState<number>();
  const [maxAge, setMaxAge] = useState<number>();

  const [showSpinner, setShowSpinner] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowSpinner(true), 200);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

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
        isGlobal: false,
      }).then(async (res) => {
        setNextCursor(res.nextCursor);

        setPicUrls((val) =>
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

        if (!areTherePictures) setAreThePictures(picUrls.length > 0);
      });

      return res;
    } finally {
      getUploadPermission().then(({ canUploadMore }) => {
        setHasReachedPicsLimit(!canUploadMore);
      });
      setIsLoading(false);
      setIsFetchingFilter(false);
      isLoadingPageRef.current = false;
      setIsLoadingPage(false);
      setIsSet(true);
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
    if (!isSet || !isFirstRender.current) getPictures();

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [sortValue, filterSelectedOption, genderOption, minAge, maxAge]);

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
        setIsUploadModalOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const EmptyPlaceholder = () => {
    return (
      <div className="flex flex-col items-center pt-3">
        <ArrowUpTrayIcon className="w-28 h-28" />
        <div className="text-xl font-bold mt-4">Upload Photo</div>
        <div className="mt-2 mb-8 text-center">
          No Photos Here.
          <br />
          Find Out Which of Your Photos Stands Out!
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
      {showSpinner && <Spinner />}
      <UploadPhotoModal
        image={selectedImage}
        filename={filename}
        isOpen={isUploadModalOpen}
        mode={Mode.Personal}
        onUpload={() => getPictures()}
        onClose={() => {
          setIsUploadModalOpen(false);
        }}
      />
      {!isLoading && picUrls.length === 0 && !areTherePictures && <EmptyPlaceholder />}
      {loggedUser && !isLoading && (picUrls.length > 0 || areTherePictures) && (
        <>
          <Header
            getPictures={getPictures}
            hasReachedPicsLimit={hasReachedPicsLimit}
            loggedUser={loggedUser}
            setIsFetchingFilter={setIsFetchingFilter}
            filterSelectedOption={filterSelectedOption}
            gender={genderOption}
            setFilterSelectedOption={setFilterSelectedOption}
            setGender={setGenderOption}
            setMaxAge={setMaxAge}
            setMinAge={setMinAge}
            setSortValue={setSortValue}
            sortValue={sortValue}
            filename={filename}
            handleFileChange={handleFileChange}
            selectedImage={selectedImage}
          />
          {picUrls.length === 1 && (
            <div className="text-danger my-1 mx-2">
              You need at least 2 photos to start getting votes in personal mode.
            </div>
          )}
          <PhotosGird
            getPictures={getPictures}
            isFetchingFilter={isFetchingFilter}
            isLoadingMorePhotos={isLoadingPage}
            loggedUser={loggedUser}
            picUrls={picUrls}
            picsInfo={picsInfo}
            setPicUrls={setPicUrls}
            setPicsInfo={setPicsInfo}
            prevCursor={prevCursor}
          />
        </>
      )}
    </>
  );
}
