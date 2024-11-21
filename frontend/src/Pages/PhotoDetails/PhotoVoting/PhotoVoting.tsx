import { Spinner } from "@/Components/Loading/Spinner";
import { getPictureVotingStats } from "@/Services/picture";
import { loadImage } from "@/Utils/image";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePhotoInfo } from "../Contexts/photoInfo";
import { VotingCard } from "./VotingCard";
import Button from "@/Components/Button";
import { MAX_FREE_STATS_PER_PIC } from "@shared/constants/purchase";

export const PhotoVoting = () => {
  const { pictureId } = useParams();

  const {
    voteStats,
    setVoteStats,
    hasMoreVotes,
    setHasMoreVotes,
    setTotalVotes,
    totalVotes,
  } = usePhotoInfo();
  const [isLoading, setIsLoading] = useState(false);
  const innerCardRef = useRef<HTMLDivElement | null>(null);
  const statCardRef = useRef<HTMLDivElement | null>(null);
  const hiddingBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pictureId || voteStats) {
      return;
    }

    setIsLoading(true);

    getPictureVotingStats(pictureId)
      .then(async ({ stats, total, hasMore }) => {
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

        setVoteStats(stats);
        setTotalVotes(total);
        setHasMoreVotes(hasMore);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const setHiddenBottomHeight = () => {
      if (
        !statCardRef.current ||
        !innerCardRef.current ||
        !hiddingBottomRef.current
      ) {
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
      <div className="text-light-text mb-5 text-xs min-[350px]:text-sm font-light max-w-[800px] mx-auto">
        <div className="">
          Explore your photo's competitive history: Discover your opponents,
          outcomes of battles (win/loss), and gain insights into the voters'
          demographics including age, gender, nationality, and ethnicity.
        </div>
        <div className="mt-1">
          <b className="font-medium">Note:</b> some votes may not appear due to
          the opponent's pic being deleted.
        </div>
      </div>

      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {voteStats?.map((stat, index) => {
            const selectedPic = stat.is_winner ? stat.winner : stat.loser;
            const otherPic = stat.is_winner ? stat.loser : stat.winner;

            const isLast = index === voteStats.length - 1 && hasMoreVotes;

            if (isLast) {
              return (
                <div
                  key={stat.id}
                  ref={statCardRef}
                  className="overflow-hidden relative"
                >
                  <div
                    ref={hiddingBottomRef}
                    className="absolute w-[102%] -left-[1%] z-10"
                  />
                  <VotingCard
                    innerCardRef={innerCardRef}
                    selectedPic={selectedPic}
                    otherPic={otherPic}
                    stat={stat}
                  />
                </div>
              );
            }

            return (
              <React.Fragment key={stat.id}>
                <VotingCard
                  selectedPic={selectedPic}
                  otherPic={otherPic}
                  stat={stat}
                />
              </React.Fragment>
            );
          })}
        </>
      )}
      {hasMoreVotes && !isLoading && (
        <div className="flex justify-center my-4">
          <Button isFull={false} variant="outline">
            Show {totalVotes - MAX_FREE_STATS_PER_PIC} more
          </Button>
        </div>
      )}
    </>
  );
};
