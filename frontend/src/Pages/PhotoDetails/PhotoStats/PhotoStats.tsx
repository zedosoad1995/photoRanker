import { Spinner } from "@/Components/Loading/Spinner";
import { getPictureStats } from "@/Services/picture";
import { loadImage } from "@/Utils/image";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePhotoInfo } from "../Contexts/photoInfo";
import { PhotoStatsMobile } from "./PhotoStatsBody/PhotoStatsMobile";
import { PhotoStatsDesktop } from "./PhotoStatsBody/PhotoStatsDesktop";

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
          <PhotoStatsMobile picStats={picStats} />
          <PhotoStatsDesktop picStats={picStats} />
        </>
      )}
    </>
  );
};
