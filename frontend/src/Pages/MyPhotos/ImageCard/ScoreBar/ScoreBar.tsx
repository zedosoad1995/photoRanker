import { useInView } from "react-intersection-observer";

interface IScoreBar {
  percentile: number | null;
}

export const ScoreBar = ({ percentile }: IScoreBar) => {
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
    delay: 30,
  });

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
  if (inView && percentile !== null) {
    displayPercentile = (percentile * 99) / 100 + 1 + "%";
  }

  return (
    <div className="rounded-lg h-4 bg-light-contour overflow-hidden">
      <div
        ref={ref}
        className={
          "transition-all duration-[250ms] ease-in rounded-lg h-full " +
          scoreBarColor
        }
        style={{
          width: displayPercentile,
        }}
      />
    </div>
  );
};
