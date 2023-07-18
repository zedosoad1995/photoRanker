import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useState } from "react";

export default function MyPhotos() {
  const [pics, setPics] = useState<string[]>([]);

  useEffect(() => {
    getManyPictures().then(async (res) => {
      const pics: string[] = [];
      for (const pic of res.pictures) {
        try {
          const tempPic = await getImage(pic.filepath);
          pics.push(URL.createObjectURL(tempPic));
        } catch (error) {}
      }
      setPics(pics);
    });

    return () => {
      pics.forEach((pic) => {
        URL.revokeObjectURL(pic);
      });
    };
  }, [pics]);

  return (
    <div className="flow-root pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
      {pics.map((pic) => (
        <img className="w-1/2 md:w-1/3 lg:w-1/4 p-3 float-left" src={pic} />
      ))}
    </div>
  );
}
