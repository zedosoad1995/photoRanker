import Button from "@/Components/Button";
import { getManyPictures, getUploadPermission } from "@/Services/picture";
import { useCallback, useEffect, useRef, useState } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import UploadPhotoModal from "./UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import { IPictureWithPercentile } from "@/Types/picture";
import { isAdmin } from "@/Utils/role";
import { useAuth } from "@/Contexts/auth";
import { Spinner } from "@/Components/Loading/Spinner";
import usePrevious from "@/Hooks/usePrevious";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import Filters from "./Filters/Filters";
import { debounce } from "underscore";
import { Mode } from "@/Constants/mode";
import { PhotosGird } from "./PhotosGrid";

const DEFAULT_SORT = "score desc";

export default function PersonalMode() {
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
  const [hasReachedPicsLimit, setHasReachedPicsLimit] = useState(true);

  const isLoadingPageRef = useRef(false);
  const [isFetchingFilter, setIsFetchingFilter] = useState(false);

  const [filterSelectedOption, setFilterSelectedOption] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>(DEFAULT_SORT);
  const [genderOption, setGenderOption] = useState<string>();
  const [minAge, setMinAge] = useState<number>();
  const [maxAge, setMaxAge] = useState<number>();

  const [showSpinner, setShowSpinner] = useState(false);

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
      getUploadPermission().then(({ canUploadMore }) => {
        setHasReachedPicsLimit(!canUploadMore);
      });
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
        isOpen={isOpen}
        mode={Mode.Personal}
        onUpload={handlePictureUpload}
        onClose={() => {
          setIsOpen(false);
        }}
      />
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
          {pics.length === 1 && (
            <div className="text-danger my-1 mx-2">
              You need at least 2 photos to start getting votes in personal mode.
            </div>
          )}
          <PhotosGird
            getPictures={getPictures}
            getPicturesAfterDelete={updatePicturesAfterDelete}
            isFetchingFilter={isFetchingFilter}
            isLoadingMorePhotos={isLoadingPage}
            loggedUser={loggedUser}
            picUrls={pics}
            picsInfo={picsInfo}
            setPicUrls={setPics}
            setPicsInfo={setPicsInfo}
          />
        </>
      )}
    </>
  );
}
