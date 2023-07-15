import { getImage, getManyPictures } from "@/Services/picture";
import { useEffect, useState } from "react";

export default function Settings() {
  const [pics, setPics] = useState<any[]>([]);

  useEffect(() => {
    getManyPictures().then(async (res) => {
      const pics: Blob[] = [];
      for (const pic of res.pictures) {
        try {
          const tempPic = await getImage(pic.filepath);
          pics.push(tempPic);
        } catch (error) {}
      }
      setPics(pics);
    });
  }, []);

  return (
    <>
      {pics.map((pic) => (
        <img src={URL.createObjectURL(pic)} />
      ))}
    </>
  );
}
