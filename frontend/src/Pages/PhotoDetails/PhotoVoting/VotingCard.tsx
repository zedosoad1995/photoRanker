import { IPictureVotingStats } from "@/Types/picture";

interface IVotingCard {
  stat: IPictureVotingStats;
  selectedPic: string | null;
  otherPic: string | null;
  innerCardRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export const VotingCard = ({
  stat,
  selectedPic,
  otherPic,
  innerCardRef,
}: IVotingCard) => (
  <div
    ref={innerCardRef}
    className="rounded-lg border shadow overflow-clip bg-white mx-auto mb-6 max-w-[800px]"
  >
    <div className="flex items-center">
      <div className="relative">
        <img src={String(selectedPic)} />
        {stat.is_winner && (
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
            }}
            className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white max-[420px]:text-sm"
          >
            Winner
          </div>
        )}
        {!stat.is_winner && (
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
            }}
            className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white max-[420px]:text-sm"
          >
            Loser
          </div>
        )}
      </div>
      <div className={`relative`}>
        <img src={String(otherPic)} />
        {!stat.is_winner && (
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(34, 197, 94, 0.9) 100%)",
            }}
            className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white max-[420px]:text-sm"
          >
            Winner
          </div>
        )}
        {stat.is_winner && (
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255, 0, 0, 0.9) 100%)",
            }}
            className="absolute -translate-x-1/2 -translate-y-full left-1/2 text-center pt-4 w-full font-semibold text-white max-[420px]:text-sm"
          >
            Loser
          </div>
        )}
      </div>
    </div>
    <div>
      <div className="flex bg-white">
        <div className="flex flex-col w-1/4 items-center py-2">
          <div className="font-semibold text-placeholder-text text-xs max-[550px]:text-[11px] max-[400px]:text-[10px]">
            GENDER
          </div>
          <div className="font-semibold max-[550px]:text-sm max-[400px]:text-xs">
            {stat.voter_gender}
          </div>
        </div>
        <div className="my-2 w-0 border-l-2" />
        <div className="flex flex-col w-1/4 items-center py-2">
          <div className="font-semibold text-placeholder-text text-xs max-[550px]:text-[11px] max-[400px]:text-[10px]">
            AGE
          </div>
          <div className="font-semibold max-[550px]:text-sm max-[400px]:text-xs">
            {stat.voter_age}
          </div>
        </div>
        <div className="my-2 w-0 border-l-2" />
        <div className="flex flex-col w-1/4 items-center py-2">
          <div className="font-semibold text-placeholder-text text-xs max-[550px]:text-[11px] max-[400px]:text-[10px]">
            COUNTRY
          </div>
          <div className="font-semibold max-[550px]:text-sm max-[400px]:text-xs text-ellipsis text-center w-full overflow-hidden">
            {stat.voter_country}
          </div>
        </div>
        <div className="my-2 w-0 border-l-2" />
        <div className="flex flex-col w-1/4 items-center py-2">
          <div className="font-semibold text-placeholder-text text-xs max-[550px]:text-[11px] max-[400px]:text-[10px]">
            ETHNICITY
          </div>
          <div className="font-semibold max-[550px]:text-sm max-[400px]:text-xs">
            {stat.voter_ethnicity}
          </div>
        </div>
      </div>
      <div className="text-sm max-[550px]:text-xs font-medium text-center -mt-2 max-[550px]:-mt-1 mb-1 text-placeholder-text">
        VOTER INFO
      </div>
    </div>
  </div>
);
