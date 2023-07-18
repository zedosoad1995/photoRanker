import Button from "@/Components/Button";
import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useState } from "react";
import { IPicture } from "../../../backend/src/types/picture";

export default function MyPhotos() {
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
  }, []);

  useEffect(() => {
    return () => {
      pics.forEach((pic) => {
        URL.revokeObjectURL(pic);
      });
    };
  }, [pics]);

  return (
    <div className="flow-root pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
      <Button>
        <span className="mr-3 text-xl !leading-5">+</span>
        <span>Add Photo</span>
      </Button>
      <div className="-mx-3">
        {pics.map((pic, index) => (
          <div key={pic} className="w-1/2 md:w-1/3 lg:w-1/4 float-left p-3">
            <div className="cursor-pointer shadow-md rounded-md overflow-hidden">
              <img src={pic} alt={`picture-${index}`} />
              <div className="p-3 font-semibold text-sm">
                <div>elo: {picsInfo[index].elo}</div>
                <div>votes: {picsInfo[index].numVotes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
