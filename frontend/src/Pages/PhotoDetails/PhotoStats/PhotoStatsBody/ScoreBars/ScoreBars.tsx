import colors from "tailwindcss/colors";
import { ScoreBar } from "./ScoreBar";
import { useMemo } from "react";
import { IPictureStats } from "@/Types/picture";

interface IScoreBars {
  picStats: IPictureStats;
}

export const ScoreBars = ({ picStats }: IScoreBars) => {
  const ageGroupText = useMemo(() => {
    if (!picStats.ageGroup) return undefined;

    return picStats.ageGroup.max === undefined
      ? picStats.ageGroup.min + "+"
      : picStats.ageGroup.min + "-" + picStats.ageGroup.max;
  }, [picStats.ageGroup]);

  return (
    <>
      <ScoreBar label="Overall" score={picStats.percentileGeneral} />
      {ageGroupText && (
        <ScoreBar
          label={ageGroupText}
          score={picStats.percentileByAgeGroup}
          color={colors.green[400]}
        />
      )}
      {picStats.ethnicity && (
        <ScoreBar
          label={picStats.ethnicity}
          score={picStats.percentileByEthnicity}
          color={colors.orange[400]}
        />
      )}
      {picStats.continent && (
        <ScoreBar
          label={picStats.continent}
          score={picStats.percentileByContinent}
          color={colors.lime[400]}
        />
      )}
    </>
  );
};
