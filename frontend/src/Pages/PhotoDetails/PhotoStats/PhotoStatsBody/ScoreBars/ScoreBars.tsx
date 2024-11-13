import colors from "tailwindcss/colors";
import { ScoreBar } from "./ScoreBar";
import { useMemo } from "react";
import { IPictureStats } from "@/Types/picture";
import { getTooltipScoreText, getUndefinedScoreText } from "./helpers";

interface IScoreBars {
  picStats: IPictureStats;
}

export const ScoreBars = ({ picStats }: IScoreBars) => {
  const ageGroupText = useMemo(() => {
    if (!picStats.ageGroup) return undefined;

    return picStats.ageGroup.max === undefined
      ? String(picStats.ageGroup.min) + "+"
      : String(picStats.ageGroup.min) + "-" + String(picStats.ageGroup.max);
  }, [picStats.ageGroup]);

  const generalTooltip = useMemo(() => {
    if (picStats.percentileGeneral === undefined) {
      return getUndefinedScoreText(picStats.gender);
    }

    return getTooltipScoreText(picStats.percentileGeneral, picStats.gender);
  }, [picStats.percentileGeneral, picStats.gender]);

  const ageTooltip = useMemo(() => {
    if (picStats.percentileByAgeGroup === undefined) {
      return getUndefinedScoreText(picStats.gender, ageGroupText, "age group");
    }

    return getTooltipScoreText(
      picStats.percentileByAgeGroup,
      picStats.gender,
      ageGroupText,
      "age group"
    );
  }, [picStats.percentileByAgeGroup, picStats.gender, ageGroupText]);

  const continentTooltip = useMemo(() => {
    if (picStats.percentileByContinent === undefined) {
      return getUndefinedScoreText(
        picStats.gender,
        picStats.continent,
        "continent"
      );
    }

    return getTooltipScoreText(
      picStats.percentileByContinent,
      picStats.gender,
      picStats.continent,
      "continent"
    );
  }, [picStats.percentileByContinent, picStats.gender, picStats.continent]);

  const ethnicityTooltip = useMemo(() => {
    if (picStats.percentileByEthnicity === undefined) {
      return getUndefinedScoreText(
        picStats.gender,
        picStats.ethnicity,
        "ethnicity"
      );
    }

    return getTooltipScoreText(
      picStats.percentileByEthnicity,
      picStats.gender,
      picStats.ethnicity,
      "ethnicity"
    );
  }, [picStats.percentileByEthnicity, picStats.gender, picStats.ethnicity]);

  return (
    <>
      <ScoreBar
        label="Overall"
        score={picStats.percentileGeneral}
        tooltipText={generalTooltip}
      />
      {ageGroupText && (
        <ScoreBar
          label={"Age: " + ageGroupText}
          score={picStats.percentileByAgeGroup}
          color={colors.green[400]}
          tooltipText={ageTooltip}
        />
      )}
      {picStats.ethnicity && (
        <ScoreBar
          label={picStats.ethnicity}
          score={picStats.percentileByEthnicity}
          color={colors.orange[400]}
          tooltipText={ethnicityTooltip}
        />
      )}
      {picStats.continent && (
        <ScoreBar
          label={picStats.continent}
          score={picStats.percentileByContinent}
          color={colors.lime[400]}
          tooltipText={continentTooltip}
        />
      )}
    </>
  );
};
