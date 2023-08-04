import { getNewMatch } from "@/Services/match";
import { getImage, getPicture } from "@/Services/picture";
import { vote } from "@/Services/vote";
import { useState, useEffect } from "react";
import { IMatch } from "../../../../backend/src/types/match";
import { SENSITIVITY } from "../../../../backend/src/constants/rating";
import Button from "@/Components/Button";
import { IMG_HEIGHT, IMG_WIDTH } from "../../../../backend/src/constants/picture";

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
        if (rightImage) {
          rightImage.click();
        }
      } else if (event.key === "ArrowLeft") {
        const leftImage = document.getElementById("leftImage");
        if (leftImage) {
          leftImage.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleClickImage = (picId?: string) => async () => {
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

  const ImageCard = ({
    className,
    pic,
    onClick,
    hasVoted,
    prob,
    id,
  }: {
    className: string;
    pic: string | undefined;
    onClick: () => void;
    hasVoted: boolean;
    prob: number | undefined;
    id?: string;
  }) => {
    const [isImageHovered, setIsImageHovered] = useState(false);

    const divClass = `${className} text-white font-bold text-xl max-w-[${IMG_WIDTH}px] max-h-[${IMG_HEIGHT}px]`;

    return (
      <div
        id={id}
        onClick={onClick}
        className={divClass}
        style={{
          backgroundImage: `${
            hasVoted ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))," : ""
          } url(${pic})`,
          backgroundSize: isImageHovered ? "101%" : "100%",
          transition: "background-size 0.5s ease",
        }}
        onMouseEnter={() => {
          setIsImageHovered(true);
        }}
        onMouseLeave={() => {
          setIsImageHovered(false);
        }}
      >
        {hasVoted ? `${prob}%` : ""}
      </div>
    );
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
          hasVoted={hasVoted}
          prob={prob1}
        />
        <ImageCard
          id="rightImage"
          className={`flex justify-center items-center cursor-pointer rounded-lg aspect-square ${imageWidthClass} bg-cover bg-center bg-no-repeat`}
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
          hasVoted={hasVoted}
          prob={prob2}
        />
      </div>
      <div className="flex sm:hidden flex-col gap-[1vw] items-center justify-start">
        <ImageCard
          id="leftImage"
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
          hasVoted={hasVoted}
          prob={prob1}
        />
        <ImageCard
          id="rightImage"
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square !max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
          hasVoted={hasVoted}
          prob={prob2}
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
