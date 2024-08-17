import { IPictureStats } from "@/Types/picture";
import { PauseActive } from "./PausedAtive";
import { ScoreBars } from "./ScoreBars/ScoreBars";
import { useWidth } from "@/Hooks/useWidth";

interface IPhotoStatsMobile {
  picStats: IPictureStats;
}

export const PhotoStatsMobile = ({ picStats }: IPhotoStatsMobile) => {
  const { width } = useWidth();

  if (width >= 640) {
    return;
  }

  return (
    <div className="shadow rounded-lg bg-white max-w-[400px] mx-auto">
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-t-lg overflow-auto w-full">
          <img src={picStats.url} alt="Photo" className="w-full" />
        </div>

        <div className="flex w-full h-10 ">
          <div className="flex items-center justify-center gap-2 w-1/2">
            <span className="font-semibold text-base">{picStats.numVotes}</span>
            <span className="font-semibold text-placeholder-text text-sm">
              VOTES
            </span>
          </div>
          <div className="my-2 w-0 border-l-2" />
          <div className="flex items-center justify-center gap-2 w-1/2">
            <PauseActive isActive={picStats.isActive} />
          </div>
        </div>
      </div>
      {picStats.isGlobal && (
        <div className="flex flex-col gap-2 mx-4 pb-6">
          <ScoreBars picStats={picStats} />
        </div>
      )}
    </div>
  );
};
