import { LockClosedIcon } from "@heroicons/react/20/solid";

interface IScoreBar {
  percentile: number | null;
  isSmall: boolean;
  isLocked?: boolean;
}

export const ScoreBar = ({
  percentile,
  isSmall,
  isLocked = false,
}: IScoreBar) => {
  if (isLocked) {
    return (
      <div className="relative group cursor-pointer">
        <LockClosedIcon
          className={`${
            isSmall ? "w-5 h-5" : "w-6 h-6"
          } absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-70 transition-opacity duration-300`}
        />
        <div
          className="bg-white absolute h-full w-full"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%)",
          }}
        />
        <div className="rounded-lg h-4 bg-light-contour overflow-hidden">
          <div className="rounded-lg bg-amber-400 h-full w-full" />
        </div>
      </div>
    );
  }

  let scoreBarColor = "";
  if (percentile !== null) {
    if (percentile < 10) {
      scoreBarColor = "bg-[#ff3232]";
    } else if (percentile >= 10 && percentile < 25) {
      scoreBarColor = "bg-[#fd811b]";
    } else if (percentile >= 25 && percentile < 50) {
      scoreBarColor = "bg-[#ffdb20]";
    } else if (percentile >= 50 && percentile < 60) {
      scoreBarColor = "bg-[#9eff00]";
    } else if (percentile >= 60 && percentile < 90) {
      scoreBarColor = "bg-[#2BDE73]";
    } else {
      scoreBarColor = "bg-[#2185ff]";
    }
  }

  let displayPercentile = "0%";
  if (percentile !== null) {
    displayPercentile = String((percentile * 99) / 100 + 1) + "%";
  }

  return (
    <div className="rounded-lg h-4 bg-light-contour overflow-hidden">
      <div
        className={
          "transition-all duration-[200ms] ease-in rounded-lg h-full " +
          scoreBarColor
        }
        style={{
          width: displayPercentile,
        }}
      />
    </div>
  );
};
