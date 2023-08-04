import { getNewMatch } from "@/Services/match";
import { getImage, getPicture } from "@/Services/picture";
import { vote } from "@/Services/vote";
import { useState, useEffect } from "react";
import { IMatch } from "../../../../backend/src/types/match";
import { SENSITIVITY } from "../../../../backend/src/constants/rating";
import Button from "@/Components/Button";
import { IMG_WIDTH } from "../../../../backend/src/constants/picture";
import { ImageCard } from "./ImageCard";

export default function Vote() {
  const [pic1, setPic1] = useState<string>();
  const [pic2, setPic2] = useState<string>();
  const [prob1, setProb1] = useState<number>();
  const [prob2, setProb2] = useState<number>();

  const [match, setMatch] = useState<IMatch["match"]>();
  const [hasVoted, setHasVoted] = useState(false);

  const getMatch = async () => {
    if (pic1) URL.revokeObjectURL(pic1);
    if (pic2) URL.revokeObjectURL(pic2);

    const { match } = await getNewMatch();
    setMatch(match);

    await getImage(match.pictures[0].filepath).then((blob) => {
      setPic1(URL.createObjectURL(blob));
    });

    await getImage(match.pictures[1].filepath).then((blob) => {
      setPic2(URL.createObjectURL(blob));
    });

    const picInfo1 = await getPicture(match.pictures[0].id);
    const picInfo2 = await getPicture(match.pictures[1].id);

    const prob1 = Math.round(
      100 / (1 + Math.pow(10, (picInfo2.picture.elo - picInfo1.picture.elo) / SENSITIVITY))
    );
    const prob2 = 100 - prob1;

    setProb1(prob1);
    setProb2(prob2);
  };

  useEffect(() => {
    getMatch();
  }, []);

  useEffect(() => {
    return () => {
      if (pic1) URL.revokeObjectURL(pic1);
      if (pic2) URL.revokeObjectURL(pic2);
    };
  }, [pic1, pic1]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        // Click the right button
        const rightImage = document.getElementById("rightImage");
        if (rightImage && !hasVoted) {
          rightImage.classList.add("!bg-[length:101%]");

          setTimeout(() => {
            rightImage.classList.remove("!bg-[length:101%]");
            rightImage.click();
          }, 200);
        }
      } else if (event.key === "ArrowLeft") {
        const leftImage = document.getElementById("leftImage");
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

  const imageWidthClass = `w-[min(40vw,${IMG_WIDTH}px)]`;

  return (
    <>
      <div className="hidden sm:flex gap-[1vw] justify-center">
        <ImageCard
          id="leftImage"
          className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square ${imageWidthClass} bg-cover bg-center bg-no-repeat`}
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
          prob={prob1}
          hasVoted={hasVoted}
        />
        <ImageCard
          id="rightImage"
          className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square ${imageWidthClass} bg-cover bg-center bg-no-repeat`}
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
          prob={prob2}
          hasVoted={hasVoted}
        />
      </div>
      <div className="flex sm:hidden flex-col gap-[1vw] items-center justify-start">
        <ImageCard
          id="leftImage"
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
          prob={prob1}
          hasVoted={hasVoted}
        />
        <ImageCard
          id="rightImage"
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
          prob={prob2}
          hasVoted={hasVoted}
        />
      </div>
      {pic1 && pic2 && (
        <div className="w-28 mx-auto mt-5">
          <Button style="secondary" onClick={handleSkipMatch}>
            Skip
          </Button>
        </div>
      )}
    </>
  );
}
