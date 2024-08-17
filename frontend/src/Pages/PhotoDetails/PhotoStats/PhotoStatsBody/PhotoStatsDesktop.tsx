import { IPictureStats } from "@/Types/picture";
import { PauseActive } from "./PausedAtive";
import { ScoreBars } from "./ScoreBars/ScoreBars";
import { useWidth } from "@/Hooks/useWidth";

interface IPhotoStatsDesktop {
  picStats: IPictureStats;
}

export const PhotoStatsDesktop = ({ picStats }: IPhotoStatsDesktop) => {
  const { width } = useWidth();

  if (width < 640) {
    return;
  }

  if (!picStats.isGlobal) {
    return (
      <div className="flex flex-col mx-auto shadow rounded-lg bg-white w-fit">
        <div className="rounded-tl-lg overflow-auto w-full">
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
    );
  }

  return (
    <div className="max-sm:hidden sm:flex max-w-[800px] mx-auto">
      <div
        className="flex flex-col justify-center items-center shadow rounded-lg bg-white"
        style={{ flex: 1 }}
      >
        <div className="rounded-tl-lg overflow-auto w-full">
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
      <div style={{ flex: 1 }}>
        <div className="flex flex-col gap-2 py-4 px-6">
          <div className="text-lg font-semibold text-center">Scores</div>
          <ScoreBars picStats={picStats} />
        </div>
      </div>
    </div>
  );
};
