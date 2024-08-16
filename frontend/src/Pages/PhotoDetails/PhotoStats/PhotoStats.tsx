import colors from "tailwindcss/colors";
import { Spinner } from "@/Components/Loading/Spinner";
import { getPictureStats } from "@/Services/picture";
import { IPictureStats } from "@/Types/picture";
import { loadImage } from "@/Utils/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ScoreBar } from "./ScoreBar";
import { PauseActive } from "./PausedAtive";

export const PhotoStats = () => {
  const { pictureId } = useParams();
  const [stats, setStats] = useState<IPictureStats>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!pictureId) {
      return;
    }

    setIsLoading(true);

    getPictureStats(pictureId)
      .then(async (stats) => {
        await loadImage(stats.url);
        setStats(stats);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pictureId]);

  const ageGroupText = useMemo(() => {
    if (!stats?.ageGroup) return undefined;

    return stats.ageGroup.max === undefined
      ? stats.ageGroup.min + "+"
      : stats.ageGroup.min + "-" + stats.ageGroup.max;
  }, [stats?.ageGroup]);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && stats && (
        <>
          <div className="max-sm:block sm:hidden shadow rounded-lg pb-6 bg-white max-w-[400px] mx-auto">
            <div className="flex flex-col justify-center items-center">
              <div className="rounded-t-lg overflow-auto w-full">
                <img src={stats.url} alt="Photo" className="w-full" />
              </div>

              <div className="flex w-full h-10 ">
                <div className="flex items-center justify-center gap-2 w-1/2">
                  <span className="font-semibold text-base">
                    {stats.numVotes}
                  </span>
                  <span className="font-semibold text-placeholder-text text-sm">
                    VOTES
                  </span>
                </div>
                <div className="my-2 w-0 border-l-2" />
                <div className="flex items-center justify-center gap-2 w-1/2">
                  <PauseActive isActive={stats.isActive} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-0 mx-4">
              {stats.percentileGeneral !== undefined && (
                <ScoreBar label="Overall" score={stats.percentileGeneral} />
              )}
              {ageGroupText && stats.percentileByAgeGroup !== undefined && (
                <ScoreBar
                  label={ageGroupText}
                  score={stats.percentileByAgeGroup}
                  color={colors.green[400]}
                />
              )}
              {stats.ethnicity && stats.percentileByEthnicity !== undefined && (
                <ScoreBar
                  label={stats.ethnicity}
                  score={stats.percentileByEthnicity}
                  color={colors.orange[400]}
                />
              )}
              {stats.percentileByContinent !== undefined && stats.continent && (
                <ScoreBar
                  label={stats.continent}
                  score={stats.percentileByContinent}
                  color={colors.lime[400]}
                />
              )}
            </div>
          </div>
          <div className="max-sm:hidden sm:flex shadow rounded-lg bg-white max-w-[800px] mx-auto">
            <div
              className="flex flex-col justify-center items-center"
              style={{ flex: 1 }}
            >
              <div className="rounded-tl-lg overflow-auto w-full">
                <img src={stats.url} alt="Photo" className="w-full" />
              </div>

              <div className="flex w-full h-10 ">
                <div className="flex items-center justify-center gap-2 w-1/2">
                  <span className="font-semibold text-base">
                    {stats.numVotes}
                  </span>
                  <span className="font-semibold text-placeholder-text text-sm">
                    VOTES
                  </span>
                </div>
                <div className="my-2 w-0 border-l-2" />
                <div className="flex items-center justify-center gap-2 w-1/2">
                  <PauseActive isActive={stats.isActive} />
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex flex-col gap-2 p-4">
                <div className="text-lg font-semibold text-center">Scores</div>
                {stats.percentileGeneral !== undefined && (
                  <ScoreBar label="Overall" score={stats.percentileGeneral} />
                )}
                {ageGroupText && stats.percentileByAgeGroup !== undefined && (
                  <ScoreBar
                    label={ageGroupText}
                    score={stats.percentileByAgeGroup}
                    color={colors.green[400]}
                  />
                )}
                {stats.ethnicity &&
                  stats.percentileByEthnicity !== undefined && (
                    <ScoreBar
                      label={stats.ethnicity}
                      score={stats.percentileByEthnicity}
                      color={colors.orange[400]}
                    />
                  )}
                {stats.percentileByContinent !== undefined &&
                  stats.continent && (
                    <ScoreBar
                      label={stats.continent}
                      score={stats.percentileByContinent}
                      color={colors.lime[400]}
                    />
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
