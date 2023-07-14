import { getImage, getManyPics } from "@/Services/picture";
import { useEffect, useState } from "react";

export default function Settings() {
  const [pics, setPics] = useState<any[]>([]);

  useEffect(() => {
    getManyPics().then(async (res) => {
      console.log(res);
      const pics = await Promise.all(res.pictures.map((pic: any) => getImage(pic.filepath)));
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
