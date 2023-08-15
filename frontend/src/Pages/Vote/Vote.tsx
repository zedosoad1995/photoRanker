import { getNewMatch } from "@/Services/match";
import { getImage, getPicture } from "@/Services/picture";
import { vote } from "@/Services/vote";
import { useState, useEffect } from "react";
import Button from "@/Components/Button";
import { IMG_WIDTH } from "@shared/constants/picture";
import { ImageCard } from "./ImageCard";
import { isScreenSmallerOrEqualTo } from "@/Utils/screen";
import { IMatch } from "@/Types/match";
import { FlagButton } from "./FlagButton";

export default function Vote() {
  const [pic1, setPic1] = useState<string>();
  const [pic2, setPic2] = useState<string>();
  const [prob1, setProb1] = useState<number>();
  const [prob2, setProb2] = useState<number>();

  const [match, setMatch] = useState<IMatch>();
  const [hasVoted, setHasVoted] = useState(false);

  const getMatch = async () => {
    const { match } = await getNewMatch();
    setMatch(match);

    await getImage(match.pictures[0].filepath).then(({ url }) => {
      setPic1(url);
    });

    await getImage(match.pictures[1].filepath).then(({ url }) => {
      setPic2(url);
    });

    /* const picInfo1 = await getPicture(match.pictures[0].id);
    const picInfo2 = await getPicture(match.pictures[1].id); */

    /* const prob1 = Math.round(
      100 / (1 + Math.pow(10, (picInfo2.picture.r - picInfo1.picture.elo) / SENSITIVITY))
    );
    const prob2 = 100 - prob1; */
    const prob1 = 50;
    const prob2 = 50;

    setProb1(prob1);
    setProb2(prob2);
  };

  useEffect(() => {
    getMatch();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        // Click the right button
        const rightImage = isScreenSmallerOrEqualTo("sm")
          ? document.getElementById("downImage")
          : document.getElementById("rightImage");
        if (rightImage && !hasVoted) {
          rightImage.classList.add("!bg-[length:101%]");

          setTimeout(() => {
            rightImage.classList.remove("!bg-[length:101%]");
            rightImage.click();
          }, 200);
        }
      } else if (event.key === "ArrowLeft") {
        const leftImage = isScreenSmallerOrEqualTo("sm")
          ? document.getElementById("upImage")
          : document.getElementById("leftImage");
        if (leftImage && !hasVoted) {
          leftImage.classList.add("!bg-[length:102%]");
          leftImage.click();

          setTimeout(() => {
            leftImage.classList.remove("!bg-[length:102%]");
          }, 200);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleClickImage = (picId?: string) => async () => {
    if (hasVoted) return;

    if (match?.id && picId) {
      await vote(match.id, picId);
    }

    setHasVoted(true);
    setTimeout(() => {
      getMatch();
      setHasVoted(false);
    }, 1000);
  };

  const handleSkipMatch = () => {
    getMatch();
  };

  return (
    <>
      <div className="hidden xs:flex gap-[1vw] justify-center">
        <ImageCard
          id="leftImage"
          className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square bg-cover bg-center bg-no-repeat`}
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
          prob={prob1}
          hasVoted={hasVoted}
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
          hasVoted={hasVoted}
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
          hasVoted={hasVoted}
        />
        <ImageCard
          id="downImage"
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[35vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
          prob={prob2}
          hasVoted={hasVoted}
        />
      </div>
      {pic1 && pic2 && match && (
        <>
          <div className="flex max-w-[35vh] xs:w-40 mx-auto mt-3 xs:mt-5 gap-2">
            <Button style="primary" variant="outline" onClick={handleSkipMatch}>
              Skip
            </Button>
            <FlagButton pic1={pic1} pic2={pic2} match={match} getMatch={getMatch} />
          </div>
        </>
      )}
    </>
  );
}
