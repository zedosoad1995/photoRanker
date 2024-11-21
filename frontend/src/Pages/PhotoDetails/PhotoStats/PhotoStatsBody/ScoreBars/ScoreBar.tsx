import { HelpIcon } from "@/Components/HelpIcon";
import { colors } from "@/theme/colors";

interface IScoreBar {
  label: string;
  score?: number;
  color?: string;
  tooltipText?: React.ReactNode;
}

export const ScoreBar = ({ label, score, color, tooltipText }: IScoreBar) => {
  let displayPercentile = "0%";
  if (score !== undefined) {
    displayPercentile = String((score * 99) / 100 + 1) + "%";
  }

  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="flex gap-1 items-center">
          <span>{label}</span>
          {tooltipText && <HelpIcon tooltipText={tooltipText} />}
        </div>
        <span className="font-semibold">
          {score !== undefined ? score.toFixed(1) + "%" : ""}
        </span>
      </div>
      <div className="rounded-md h-3 bg-light-contour overflow-hidden">
        <div
          className={`transition-all duration-[200ms] ease-in rounded-md h-full`}
          style={{
            width: displayPercentile,
            backgroundColor: color ?? colors.primary,
          }}
        />
      </div>
    </div>
  );
};
