import { PauseIcon } from "@heroicons/react/20/solid";
import colors from "tailwindcss/colors";
import { ScoreBar } from "../PhotoDetails/PhotoStats/PhotoStatsBody/ScoreBars/ScoreBar";

export const PhotoStats = () => {
  return (
    <section className="py-20 md:py-[111px] px-5 sm:px-[70px] bg-[#F8FBFD]">
      <div
        className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]`}
      >
        See Photo Statistics
      </div>
      <div className="mb-[25px] w-[82px] h-[6px] bg-[#eee] mx-auto" />
      <div className="text-[#82898f] text-base font-light mb-5 text-center">
        See how well do you rank in your age group, ethnicity, and continent.
        This allows you to compete with people of similar demographic groups and
        have a more detailed insight of your photo.
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
    </section>
  );
};
