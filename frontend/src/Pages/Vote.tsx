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

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-none gap-y-5 md:gap-x-5 md:gap-y-0 items-center justify-items-center h-full">
      <div
        onClick={handleClickImage(match?.pictures[0].id)}
        className="w-full h-full flex justify-center items-center cursor-pointer border-2"
      >
        <img src={pic1} className="border max-h-full" alt="image1" />
      </div>
      <div
        onClick={handleClickImage(match?.pictures[1].id)}
        className="w-full h-full flex justify-center items-center cursor-pointer border-2"
      >
        <img src={pic2} className="border max-h-full" alt="image2" />
      </div>
    </div>
  );
}
