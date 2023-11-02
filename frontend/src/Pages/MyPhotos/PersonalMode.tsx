import Button from "@/Components/Button";
import { getManyPictures, getUploadPermission } from "@/Services/picture";
import { useEffect, useRef, useState } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "@shared/constants/picture";
import { getImageDimensionsFromBase64 } from "@/Utils/image";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import { isAdmin } from "@/Utils/role";
import { useAuth } from "@/Contexts/auth";
import { Spinner } from "@/Components/Loading/Spinner";
import usePrevious from "@/Hooks/usePrevious";
import useInfiniteScroll from "@/Hooks/useInfiniteScroll";
import { PhotosGird } from "./PhotosGrid";
import { Header } from "./Header";
import UploadPhotoModal from "./UploadPhotoModal";
import { Mode } from "@/Constants/mode";
import { useMyPhotos } from "./Contexts/myPhotos";

export default function PersonalMode() {
  const { state, dispatch } = useMyPhotos();
  const { user: loggedUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    width: number;
    height: number;
  } | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!state.isSet);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const prevCursor = usePrevious(state.nextCursor);

  const [areTherePictures, setAreThePictures] = useState(false);
  const [hasReachedPicsLimit, setHasReachedPicsLimit] = useState(false);

  const isLoadingPageRef = useRef(false);
  const [isFetchingFilter, setIsFetchingFilter] = useState(false);

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

      const orderByKey = state.sortValue.split(" ")[0];
      const orderByDir = state.sortValue.split(" ")[1];

      const res = await getManyPictures({
        ...(isAdmin(loggedUser.role) ? {} : { userId: loggedUser.id }),
        ...(state.filterSelect ? { [state.filterSelect]: true } : {}),
        gender: state.gender,
        orderBy: orderByKey,
        minAge: state.minAge,
        maxAge: state.maxAge,
        orderByDir,
        limit: 30,
        cursor,
        isGlobal: false,
      }).then(async (res) => {
        dispatch({ key: "nextCursor", value: res.nextCursor });

        dispatch({
          key: "picUrls",
          value: cursor
            ? [...new Set([...state.picUrls, ...res.pictures.map(({ url }) => url)])]
            : res.pictures.map(({ url }) => url),
        });

        dispatch({
          key: "picsInfo",
          value: cursor
            ? [
                ...new Set([
                  ...state.picsInfo.map((row) => JSON.stringify(row)),
                  ...res.pictures.map((pic) => JSON.stringify(pic)),
                ]),
              ].map((row) => JSON.parse(row))
            : res.pictures.map((pic) => pic),
        });

        if (!areTherePictures) setAreThePictures(state.picUrls.length > 0);
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
      dispatch({ key: "isSet", value: true });
    }
  };

  const handleScrollUpdate = () => {
    if (state.nextCursor) {
      isLoadingPageRef.current = true;
      setIsLoadingPage(true);
      getPictures(state.nextCursor);
    }
  };

  useInfiniteScroll({ isLoading: isLoadingPageRef.current, onUpdate: handleScrollUpdate }, [
    state.nextCursor,
  ]);

  useEffect(() => {
    if (!state.isSet || !isFirstRender.current) getPictures();

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [state.sortValue, state.filterSelect, state.gender, state.minAge, state.maxAge]);

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
      {!isLoading && state.picUrls.length === 0 && !areTherePictures && <EmptyPlaceholder />}
      {loggedUser && !isLoading && (state.picUrls.length > 0 || areTherePictures) && (
        <>
          <Header
            getPictures={getPictures}
            hasReachedPicsLimit={hasReachedPicsLimit}
            loggedUser={loggedUser}
            setIsFetchingFilter={setIsFetchingFilter}
            filename={filename}
            handleFileChange={handleFileChange}
            selectedImage={selectedImage}
            filterState={state}
            filterDispatch={dispatch}
          />
          {state.picUrls.length === 1 && (
            <div className="text-danger my-1 mx-2">
              You need at least 2 photos to start getting votes in personal mode.
            </div>
          )}
          <PhotosGird
            getPictures={getPictures}
            isFetchingFilter={isFetchingFilter}
            isLoadingMorePhotos={isLoadingPage}
            loggedUser={loggedUser}
            picUrls={state.picUrls}
            picsInfo={state.picsInfo}
            setPicUrls={(value) => dispatch({ key: "picUrls", value })}
            setPicsInfo={(value) => dispatch({ key: "picsInfo", value })}
            prevCursor={prevCursor}
          />
        </>
      )}
    </>
  );
}
