import { getNewMatch } from "@/Services/match";
import { getImage } from "@/Services/picture";
import { vote } from "@/Services/vote";
import { useState, useEffect } from "react";
import { IMatch } from "../../../backend/src/types/match";

export default function Vote() {
  const [pic1, setPic1] = useState<string>();
  const [pic2, setPic2] = useState<string>();
  const [match, setMatch] = useState<IMatch["match"]>();

  const getMatch = async () => {
    if (pic1) URL.revokeObjectURL(pic1);
    if (pic2) URL.revokeObjectURL(pic2);

    const { match } = await getNewMatch();
    setMatch(match);

    getImage(match.pictures[0].filepath).then((blob) => {
      setPic1(URL.createObjectURL(blob));
    });

    getImage(match.pictures[1].filepath).then((blob) => {
      setPic2(URL.createObjectURL(blob));
    });
  };

  useEffect(() => {
    getMatch();
  }, []);

  useEffect(() => {
    return () => {
      console.log(pic1, pic2);

      if (pic1) URL.revokeObjectURL(pic1);
      if (pic2) URL.revokeObjectURL(pic2);
    };
  }, [pic1, pic1]);

  const handleClickImage = (picId?: string) => async () => {
    if (match?.id && picId) {
      await vote(match.id, picId);
    }
    getMatch();
  };

  const ImageCard = ({
    className,
    pic,
    onClick,
  }: {
    className: string;
    pic: string | undefined;
    onClick: () => void;
  }) => {
    const [isImageHovered, setIsImageHovered] = useState(false);

    return (
      <div
        onClick={onClick}
        className={className}
        style={{
          backgroundImage: `url(${pic})`,
          backgroundSize: isImageHovered ? "101%" : "100%",
          transition: "background-size 0.5s ease",
        }}
        onMouseEnter={() => {
          setIsImageHovered(true);
        }}
        onMouseLeave={() => {
          setIsImageHovered(false);
        }}
      />
    );
  };

  /* 
  CASE to show the whole image 
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-none gap-y-5 md:gap-x-5 md:gap-y-0 justify-items-center md:h-[50vh] h-full">
      <ImageCard
        className="w-full flex justify-center items-center cursor-pointer border rounded-lg md:h-[50vh] bg-contain bg-no-repeat bg-center"
        onClick={handleClickImage(match?.pictures[0].id)}
        pic={pic1}
      />
      <ImageCard
        className="w-full flex justify-center items-center cursor-pointer border rounded-lg md:h-[50vh] bg-contain bg-no-repeat bg-center"
        onClick={handleClickImage(match?.pictures[1].id)}
        pic={pic2}
      />
    </div>
  ); */

  return (
    <>
      <div className="hidden sm:flex gap-[1vw] justify-center h-full">
        <ImageCard
          className="flex justify-center items-center cursor-pointer rounded-lg h-[40vw] w-[40vw] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
        />
        <ImageCard
          className="flex justify-center items-center cursor-pointer rounded-lg h-[40vw] w-[40vw] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
        />
      </div>
      <div className="flex sm:hidden flex-col gap-[1vw] items-center h-full justify-start">
        <ImageCard
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[0].id)}
          pic={pic1}
        />
        <ImageCard
          className="flex justify-center items-center cursor-pointer rounded-lg w-full aspect-square max-w-[40vh] bg-cover bg-center bg-no-repeat"
          onClick={handleClickImage(match?.pictures[1].id)}
          pic={pic2}
        />
      </div>
    </>
  );
}
