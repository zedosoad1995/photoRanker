import { HelpIcon } from "@/Components/HelpIcon";
import { colors } from "@/theme/colors";

interface IScoreBar {
  label: string;
  score?: number;
  color?: string;
  tooltipText?: React.ReactNode;
}

export const ScoreBar = ({ label, score, color, tooltipText }: IScoreBar) => {
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
      <div className="rounded-md h-2 bg-light-contour overflow-hidden">
        <div
          className={`rounded-md h-full`}
          style={{
            width: score !== undefined ? (score * 99) / 100 + 1 + "%" : 0,
            backgroundColor: color ?? colors.primary,
          }}
        />
      </div>
    </div>
  );
};
