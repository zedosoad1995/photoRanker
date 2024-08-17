import { Spinner } from "@/Components/Loading/Spinner";
import { getPictureStats } from "@/Services/picture";
import { loadImage } from "@/Utils/image";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PauseActive } from "./PausedAtive";
import { usePhotoInfo } from "../Contexts/photoInfo";
import { ScoreBars } from "./ScoreBars/ScoreBars";

export const PhotoStats = () => {
  const { pictureId } = useParams();
  const { picStats, setPicStats } = usePhotoInfo();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pictureId || picStats) {
      return;
    }

    setIsLoading(true);

    getPictureStats(pictureId)
      .then(async (stats) => {
        await loadImage(stats.url);
        setPicStats(stats);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && picStats && (
        <>
          <div className="max-sm:block sm:hidden shadow rounded-lg pb-6 bg-white max-w-[400px] mx-auto">
            <div className="flex flex-col justify-center items-center">
              <div className="rounded-t-lg overflow-auto w-full">
                <img src={picStats.url} alt="Photo" className="w-full" />
              </div>

              <div className="flex w-full h-10 ">
                <div className="flex items-center justify-center gap-2 w-1/2">
                  <span className="font-semibold text-base">
                    {picStats.numVotes}
                  </span>
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
            <div className="flex flex-col gap-2 mt-0 mx-4">
              <ScoreBars picStats={picStats} />
            </div>
          </div>
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
                  <span className="font-semibold text-base">
                    {picStats.numVotes}
                  </span>
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
        </>
      )}
    </>
  );
};
