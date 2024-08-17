import { updateImage } from "@/Services/picture";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { usePhotoInfo } from "../../Contexts/photoInfo";
import { useParams } from "react-router-dom";
import { usePhotos } from "@/Contexts/photos";

interface IPauseActive {
  isActive: boolean;
}

export const PauseActive = ({ isActive }: IPauseActive) => {
  const { pictureId } = useParams();
  const { picStats, setPicStats } = usePhotoInfo();
  const { setPicsInfo } = usePhotos(picStats?.isGlobal ? "global" : "personal");

  const text = isActive ? "ACTIVE" : "PAUSED";
  const Icon = isActive ? PauseIcon : PlayIcon;

  const handleChangeActive = async () => {
    if (!pictureId) return;

    const updatedPic = await updateImage(pictureId, {
      isActive: !isActive,
    });

    setPicsInfo((picsInfo) => {
      if (!picsInfo) return picsInfo;

      const index = picsInfo.findIndex(({ id }) => id === pictureId);
      if (index === -1) {
        return picsInfo;
      }

      picsInfo[index].isActive = updatedPic.isActive;
      return picsInfo;
    });

    setPicStats((stats) => {
      if (!stats) return;

      return { ...stats, isActive: updatedPic.isActive };
    });
  };

  return (
    <div
      onClick={handleChangeActive}
      className="flex items-center justify-center gap-2 w-1/2 cursor-pointer"
    >
      <Icon className="h-4 w-4 text-center" />
      <span className="font-semibold text-placeholder-text text-sm leading-none">
        {text}
      </span>
    </div>
  );
};
