import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { PhotoModeSelect } from "./PhotoStats/PhotoModeSelect";
import { PhotoStats } from "./PhotoStats/PhotoStats";
import { PhotoVoting } from "./PhotoVoting/PhotoVoting";
import { useNavigate } from "react-router-dom";
import { PHOTOS } from "@/Constants/routes";
import { useState } from "react";
import { IPhotoMode, PhotoMode } from "@/Constants/mode";
import { DO_NOT_FETCH_PHOTOS, PHOTO_MODE } from "@/Constants/localStorageKeys";

export const PhotoDetails = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<IPhotoMode>(
    (localStorage.getItem(PHOTO_MODE) as IPhotoMode) ?? PhotoMode.Stats
  );

  const handleUpdateMode = (mode: IPhotoMode) => {
    localStorage.setItem(PHOTO_MODE, mode);
    setMode(mode);
  };

  const handleNavigateBack = () => {
    navigate(PHOTOS);
    localStorage.setItem(DO_NOT_FETCH_PHOTOS, "true");
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-3 max-w-[800px] mx-auto">
        <button
          onClick={handleNavigateBack}
          className="rounded-full hover:bg-black/5 cursor-pointer p-1 transition-colors duration-150 ease-in"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="text-xl min-[350px]:text-2xl font-semibold">
          Photo Details
        </div>
      </div>
      <div className="mb-4 max-w-[800px] mx-auto">
        <PhotoModeSelect mode={mode} handleUpdateMode={handleUpdateMode} />
      </div>
      {mode === "stats" && <PhotoStats />}
      {mode === "votes" && <PhotoVoting />}
    </>
  );
};
