import { PauseIcon } from "@heroicons/react/20/solid";
import colors from "tailwindcss/colors";
import { ScoreBar } from "../PhotoDetails/PhotoStats/PhotoStatsBody/ScoreBars/ScoreBar";
import { useInView } from "react-intersection-observer";

export const PhotoStats = () => {
  const { ref: rootRef, inView: inViewRoot } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={rootRef}
      className={`${
        inViewRoot ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 ease-in`}
    >
      <div className="text-[#374048] text-3xl lg:text-4xl font-semibold mb-5 text-center">
        See Photo Statistics
      </div>
      <div className="text-[#82898f] text-lg font-light mb-5 text-center">
        See how well do you rank in your age group, ethnicity, and continent.
        This allows you to compete with people of similar demographic
        backgrounds and have a more detailed insight of your photo.
      </div>
      <div className="shadow rounded-lg bg-white max-w-[400px] mx-auto">
        <div className="flex flex-col justify-center items-center">
          <div className="rounded-t-lg overflow-auto w-full">
            <img
              src="/mature_man.webp"
              alt="person photo stats"
              className="w-full"
            />
          </div>

          <div className="flex w-full h-10 ">
            <div className="flex items-center justify-center gap-2 w-1/2">
              <span className="font-semibold text-base">37</span>
              <span className="font-semibold text-placeholder-text text-sm">
                VOTES
              </span>
            </div>
            <div className="my-2 w-0 border-l-2" />
            <div className="flex items-center justify-center gap-2 w-1/2 cursor-pointer">
              <PauseIcon className="h-4 w-4 text-center" />
              <span className="font-semibold text-placeholder-text text-sm leading-none">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mx-4 pb-6">
          <ScoreBar
            label="Overall"
            score={45.0}
            tooltipText="This photo is more attractive than 45% of the Male population."
          />
          <ScoreBar
            label="Age: 50+"
            score={76.2}
            color={colors.green[400]}
            tooltipText="This photo is more attractive than 76.2% of the Male population for the age group: 50+."
          />
          <ScoreBar
            label="White"
            score={40.1}
            color={colors.orange[400]}
            tooltipText="This photo is more attractive than 40.1% of the Male population for the ethnicity: White."
          />
          <ScoreBar
            label="Europe"
            score={38.1}
            color={colors.lime[400]}
            tooltipText="This photo is more attractive than 40.1% of the Male population for continent: Europe."
          />
        </div>
      </div>
    </div>
  );
};
