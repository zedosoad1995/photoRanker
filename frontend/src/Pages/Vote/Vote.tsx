import { getNewMatch } from "@/Services/match";
import { vote } from "@/Services/vote";
import { useState, useEffect, useRef } from "react";
import Button from "@/Components/Button";
import { IMG_WIDTH } from "@shared/constants/picture";
import { ImageCard } from "./ImageCard";
import { isScreenSmallerOrEqualTo } from "@/Utils/screen";
import { IMatch } from "@/Types/match";
import { FlagButton } from "./FlagButton";
import useDeferredState from "@/Hooks/useDeferredState";
import { loadImage } from "@/Utils/image";
import { Spinner } from "@/Components/Loading/Spinner";
import { NoVotesPlaceholder } from "./NoVotesPlaceholder";
import { TIME_VOTE_TRANSITION } from "@/Constants/vote";

export default function Vote() {
  const [{ pic1, pic2, match, prob1, prob2 }, setState, applyUpdates] = useDeferredState<{
    pic1?: string;
    pic2?: string;
    prob1?: number;
    prob2?: number;
    match?: IMatch;
  }>({
    pic1: undefined,
    pic2: undefined,
    prob1: undefined,
    prob2: undefined,
    match: undefined,
  });

  const hasVoted = useRef(false);
  const canGoToNextRef = useRef(true);
  const isPic1Loaded = useRef(false);
  const isPic2Loaded = useRef(false);
  const [_, setRerender] = useState(0);
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);
  const [isLoadingPic1, setIsLoadingPic1] = useState(false);
  const [isLoadingPic2, setIsLoadingPic2] = useState(false);

  const isImagesFetching = !isPic1Loaded.current || !isPic2Loaded.current;

  const getMatch = async (mustWaitDefer = false) => {
    setIsLoadingPic1(true);
    setIsLoadingPic2(true);
    isPic1Loaded.current = false;
    isPic2Loaded.current = false;

    const { match } = await getNewMatch();

    setState("match", match, mustWaitDefer);

    setState("pic1", match.pictures[0].url, mustWaitDefer);
    loadImage(match.pictures[0].url).finally(() => {
      isPic1Loaded.current = true;
      setRerender((val) => val + 1);
    });

    setState("pic2", match.pictures[1].url, mustWaitDefer);
    loadImage(match.pictures[1].url).finally(() => {
      isPic2Loaded.current = true;
      setRerender((val) => val + 1);
    });

    const prob1 = match.winProbability * 100;
    const prob2 = 100 - prob1;

    setState("prob1", prob1, mustWaitDefer);
    setState("prob2", prob2, mustWaitDefer);
  };

  useEffect(() => {
    getMatch().finally(() => {
      setIsLoadingMatch(false);
      setIsLoadingPic1(false);
      setIsLoadingPic2(false);
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        // Click the right button
        const rightImage = isScreenSmallerOrEqualTo(450)
          ? document.getElementById("downImage")
          : document.getElementById("rightImage");

        if (rightImage && !hasVoted.current) {
          rightImage.classList.add("!bg-[length:103%]");
          rightImage.click();

          setTimeout(() => {
            rightImage.classList.remove("!bg-[length:103%]");
          }, 100);
        }
      } else if (event.key === "ArrowLeft") {
        const leftImage = isScreenSmallerOrEqualTo(450)
          ? document.getElementById("upImage")
          : document.getElementById("leftImage");
        if (leftImage && !hasVoted.current) {
          leftImage.classList.add("!bg-[length:103%]");
          leftImage.click();

          setTimeout(() => {
            leftImage.classList.remove("!bg-[length:103%]");
          }, 100);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleClickImage = (picId?: string) => async () => {
    if (hasVoted.current) return;

    canGoToNextRef.current = false;

    if (match?.id && picId) {
      vote(match.id, picId).finally(() => {
        getMatch(true)
          .catch(() => {
            setTimeout(() => {
              hasVoted.current = false;
              applyUpdates();
              clearInterval(interval);
              setRerender((val) => val + 1);
              setState("match", undefined);
            }, TIME_VOTE_TRANSITION);
          })
          .finally(() => {
            canGoToNextRef.current = true;
          });
      });
    }

    hasVoted.current = true;
    setRerender((val) => val + 1);

    let intervalTime = TIME_VOTE_TRANSITION;
    const checkCondition = () => {
      if (canGoToNextRef.current && isPic1Loaded.current && isPic2Loaded.current) {
        hasVoted.current = false;
        applyUpdates();
        clearInterval(interval);
        setRerender((val) => val + 1);
      } else if (intervalTime === TIME_VOTE_TRANSITION) {
        intervalTime = 100;
        clearInterval(interval);
        interval = setInterval(checkCondition, intervalTime);
      }
    };

    let interval = setInterval(checkCondition, intervalTime);
  };

  const handleSkipMatch = async () => {
    try {
      if (match) {
        await vote(match.id);
      }
    } finally {
      getMatch().catch(() => {
        setState("match", undefined);
      });
    }
  };

  const handleReport = () => {
    getMatch().catch(() => {
      setState("match", undefined);
    });
  };

  return (
    <>
      {isLoadingMatch && (isLoadingPic1 || isLoadingPic2) && <Spinner />}
      {!isLoadingMatch && !match && <NoVotesPlaceholder />}
      {pic1 && pic2 && match && (
        <>
          <div className="hidden xs:flex gap-[1vw] justify-center">
            <ImageCard
              id="leftImage"
              className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square bg-cover bg-center bg-no-repeat`}
              onClick={handleClickImage(match?.pictures[0].id)}
              pic={pic1}
              prob={prob1}
              isLoading={isImagesFetching}
              hasVoted={hasVoted.current}
              style={{
                width: `min(40vw,${IMG_WIDTH}px)`,
              }}
            />
            <ImageCard
              id="rightImage"
              className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square bg-cover bg-center bg-no-repeat`}
              onClick={handleClickImage(match?.pictures[1].id)}
              pic={pic2}
              prob={prob2}
              isLoading={isImagesFetching}
              hasVoted={hasVoted.current}
              style={{
                width: `min(40vw,${IMG_WIDTH}px)`,
              }}
            />
          </div>
          <div className="flex xs:hidden flex-col gap-[1vw] items-center justify-start">
            <ImageCard
              id="upImage"
              className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[35vh] bg-cover bg-center bg-no-repeat"
              onClick={handleClickImage(match?.pictures[0].id)}
              pic={pic1}
              prob={prob1}
              isLoading={isImagesFetching}
              hasVoted={hasVoted.current}
            />
            <ImageCard
              id="downImage"
              className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[35vh] bg-cover bg-center bg-no-repeat"
              onClick={handleClickImage(match?.pictures[1].id)}
              pic={pic2}
              prob={prob2}
              isLoading={isImagesFetching}
              hasVoted={hasVoted.current}
            />
          </div>
        </>
      )}
      {pic1 && pic2 && match && (
        <>
          <div className="flex max-w-[35vh] xs:w-40 mx-auto mt-3 xs:mt-5 gap-2">
            <Button isFull style="primary" variant="outline" onClick={handleSkipMatch}>
              Skip
            </Button>
            <FlagButton pic1={pic1} pic2={pic2} match={match} onReport={handleReport} />
          </div>
        </>
      )}
    </>
  );
}
