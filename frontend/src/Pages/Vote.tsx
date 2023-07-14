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
    const { match } = await getNewMatch();
    setMatch(match);

    getImage(match.pictures[0].filepath).then((response) => {
      setPic1(URL.createObjectURL(response));
    });

    getImage(match.pictures[1].filepath).then((response) => {
      setPic2(URL.createObjectURL(response));
    });
  };

  useEffect(() => {
    getMatch();
  }, []);

  const handleClickImage = (picId?: string) => async () => {
    if (match?.id && picId) {
      await vote(match.id, picId);
    }
    getMatch();
  };

  return (
    <>
      <img src={pic1} onClick={handleClickImage(match?.pictures[0].id)} />
      <img src={pic2} onClick={handleClickImage(match?.pictures[1].id)} />
    </>
  );
}
