import Button from "@/Components/Button";
import { Spinner } from "@/Components/Loading/Spinner";
import { PHOTOS } from "@/Constants/routes";
import { getPictureVotingStats } from "@/Services/picture";
import { IPictureVotingStats } from "@/Types/picture";
import { loadImage } from "@/Utils/image";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { MAX_FREE_STATS_PER_PIC } from "@shared/constants/purchase";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UnlimitedStatsModal from "./UnlimitedStatsModal";

export const PhotoVotingStats = () => {
  const navigate = useNavigate();
  const { pictureId } = useParams();

  const [stats, setStats] = useState<IPictureVotingStats[]>([]);
  const [count, setCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenBuyStatsModal, setIsOpenBuyStatsModal] = useState(false);
  const innerCardRef = useRef<HTMLDivElement | null>(null);
  const statCardRef = useRef<HTMLDivElement | null>(null);
  const hiddingBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pictureId) {
      return;
    }

    setIsLoading(true);

    getPictureVotingStats(pictureId)
      .then(async ({ stats, total, hasMore }) => {
        setStats(stats);
        setCount(total);
        setHasMore(hasMore);

        await Promise.all(
          stats.flatMap(({ winner, loser }) => {
            return [
              (() => {
                if (!winner) return;
                return loadImage(winner);
              })(),
              (() => {
                if (!loser) return;
                return loadImage(loser);
              })(),
            ];
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pictureId]);

  useEffect(() => {
    if (isLoading) return;

    const setHiddenBottomHeight = () => {
      if (!statCardRef.current || !innerCardRef.current || !hiddingBottomRef.current) {
        return;
      }

      const height = innerCardRef.current.getBoundingClientRect().height;

      const cutOffHeight = height * 0.3;

      statCardRef.current.style.height = `${cutOffHeight}px`;
      hiddingBottomRef.current.style.height = `${cutOffHeight}px`;
      hiddingBottomRef.current.style.background = `linear-gradient(to bottom, #F8F8FB00 0px, #F8F8FBFF ${cutOffHeight}px)`;
    };

    setHiddenBottomHeight();

    window.addEventListener("resize", setHiddenBottomHeight);
    return () => {
      window.removeEventListener("resize", setHiddenBottomHeight);
    };
  }, [isLoading]);

  return (
    <>
      <UnlimitedStatsModal
        isOpen={isOpenBuyStatsModal}
        onClose={() => setIsOpenBuyStatsModal(false)}
      />
      <div className="relative">
        <div className="flex gap-2 items-center mb-3 max-w-[800px] mx-auto">
          <button
            onClick={() => navigate(PHOTOS)}
            className="rounded-full hover:bg-black/5 cursor-pointer p-1 transition-colors duration-150 ease-in"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-xl min-[350px]:text-2xl font-semibold">Photo Votes</div>
        </div>
        <div className="text-light-text mb-5 text-xs min-[350px]:text-sm font-light max-w-[800px] mx-auto">
          <div className="">
            Explore your photo's competitive history: Discover your opponents, outcomes of battles
            (win/loss), and gain insights into the voters' demographics including age, gender,
            nationality, and ethnicity.
          </div>
          <div className="mt-1">
            <b className="font-medium">Note:</b> some votes may not appear due to the opponent's pic
            being deleted.
          </div>
        </div>

        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            {stats.map((stat, index) => {
              const selectedPic = stat.is_winner ? stat.winner : stat.loser;
              const otherPic = stat.is_winner ? stat.loser : stat.winner;

              const isLast = index === stats.length - 1 && hasMore;

              const VotingCard = (
                <div
                  ref={isLast ? innerCardRef : undefined}
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

              if (isLast) {
                return (
                  <div key={stat.id} ref={statCardRef} className="overflow-hidden relative">
                    <div ref={hiddingBottomRef} className="absolute w-[102%] -left-[1%] z-10" />
                    {VotingCard}
                  </div>
                );
              }

              return <React.Fragment key={stat.id}>{VotingCard}</React.Fragment>;
            })}
          </>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center my-4">
            <Button onClick={() => setIsOpenBuyStatsModal(true)} isFull={false} variant="outline">
              Show {count - MAX_FREE_STATS_PER_PIC} more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};