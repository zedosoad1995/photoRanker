import Button from "@/Components/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import UploadPhotoModal from "./Modals/UploadPhotoModal";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import { useAuth } from "@/Contexts/auth";
import { Spinner } from "@/Components/Loading/Spinner";
import usePrevious from "@/Hooks/usePrevious";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { Mode } from "@/Constants/mode";
import { PhotosGird } from "./PhotosGrid";
import { Header } from "./Header";
import { useMyPhotos } from "./Contexts/myPhotos";
import {
  DO_NOT_FETCH_PHOTOS,
  SCROLL_POSITION,
} from "@/Constants/localStorageKeys";

export default function GlobalMode() {
  const {
    state,
    dispatch,
    getPictures: _getPictures,
    isLoadingMoreImages,
    updateLoadingMoreImages,
  } = useMyPhotos();
  const { user: loggedUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    width: number;
    height: number;
  } | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const prevCursor = usePrevious(state.nextCursor);

  const [showSpinner, setShowSpinner] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInitLoading) {
      timer = setTimeout(() => setShowSpinner(true), 200);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [isInitLoading]);

  const getPictures = async (cursor?: string) => {
    if (isFirstRender) {
      setIsInitLoading(true);
    }

    await _getPictures(cursor).finally(() => {
      setIsInitLoading(false);
    });
  };

  const handleScrollUpdate = useCallback(() => {
    if (state.nextCursor) {
      updateLoadingMoreImages(true);
      getPictures(state.nextCursor);
    }
  }, [isFirstRender, state.nextCursor]);

  useInfiniteScroll(
    { isLoading: isLoadingMoreImages.ref, onUpdate: handleScrollUpdate },
    [state.nextCursor]
  );

  useEffect(() => {
    if (
      (!state.isSet &&
        (localStorage.getItem(DO_NOT_FETCH_PHOTOS) !== "true" ||
          !state.picsInfo ||
          !state.picUrls)) ||
      !isFirstRender
    ) {
      getPictures();
    }

    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [
    state.sortValue,
    state.filterSelect,
    state.gender,
    state.minAge,
    state.maxAge,
  ]);

  useEffect(() => {
    if (!isFirstRender) {
      localStorage.removeItem(DO_NOT_FETCH_PHOTOS);
    }
  }, [isFirstRender]);

  useEffect(() => {
    const scrollPosition = localStorage.getItem(SCROLL_POSITION);
    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition));
        localStorage.removeItem(SCROLL_POSITION);
      }, 0);
    }
  }, []);

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

        const { height, width } = await getImageDimensionsFromBase64(
          base64Image
        );

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

  const EmptyPlaceholder = () => {
    return (
      <div className="flex flex-col items-center pt-3">
        <ArrowUpTrayIcon className="w-28 h-28" />
        <div className="text-xl font-bold mt-4">Upload Photo</div>
        <div className="mt-2 mb-8 text-center">
          No Photos Yet.
          <br />
          Find how attractive you are by Uploading Your First Photo!
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
        mode={Mode.Global}
        onUpload={handlePictureUpload}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {!isInitLoading &&
        !state.picUrls?.length &&
        loggedUser?.role !== "ADMIN" && <EmptyPlaceholder />}
      {loggedUser &&
        !isInitLoading &&
        (state.picUrls?.length || loggedUser.role === "ADMIN") && (
          <>
            <Header
              getPictures={getPictures}
              hasReachedPicsLimit={state.hasReachedPicsLimit}
              loggedUser={loggedUser}
              setIsFetchingFilter={(value) =>
                dispatch({ key: "isFetchingFilter", value })
              }
              filename={filename}
              handleFileChange={handleFileChange}
              selectedImage={selectedImage}
              filterState={state}
              filterDispatch={dispatch}
            />
            <PhotosGird
              getPictures={getPictures}
              isFetchingFilter={state.isFetchingFilter}
              isLoadingMorePhotos={isLoadingMoreImages.state}
              loggedUser={loggedUser}
              ageGroup={state.ageGroup}
              picUrls={state.picUrls ?? []}
              picsInfo={state.picsInfo ?? []}
              setPicUrls={(value) => dispatch({ key: "picUrls", value })}
              setPicsInfo={(value) => dispatch({ key: "picsInfo", value })}
              prevCursor={prevCursor}
              isGlobal
            />
          </>
        )}
    </>
  );
}
