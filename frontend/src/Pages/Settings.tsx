import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useState } from "react";
import { IPicture } from "../../../backend/src/types/picture";

export default function Settings() {
  const [pics, setPics] = useState<string[]>([]);
  const [picsInfo, setPicsInfo] = useState<IPicture[]>([]);

  useEffect(() => {
    getManyPictures().then(async (res) => {
      const pics: string[] = [];
      const picsInfo: IPicture[] = [];
      for (const pic of res.pictures) {
        try {
          const tempPic = await getImage(pic.filepath);
          pics.push(URL.createObjectURL(tempPic));
          picsInfo.push(pic);
        } catch (error) {}
      }
      setPics(pics);
      setPicsInfo(picsInfo);
    });

    return () => {
      pics.forEach((pic) => {
        URL.revokeObjectURL(pic);
      });
    };
  }, [pics]);

  return (
    <>
      {pics.map((pic, index) => (
        <>
          <img src={pic} />
          <div>
            Elo: {picsInfo[index].elo}, Num Votes: {picsInfo[index].numVotes}
          </div>
        </>
      ))}
    </>
  );
}
