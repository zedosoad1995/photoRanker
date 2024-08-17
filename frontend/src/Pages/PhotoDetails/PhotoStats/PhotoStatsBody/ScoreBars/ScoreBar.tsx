import { colors } from "@/theme/colors";

interface IScoreBar {
  label: string;
  score?: number;
  color?: string;
}

export const ScoreBar = ({ label, score, color }: IScoreBar) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
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
