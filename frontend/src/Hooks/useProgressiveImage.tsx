import { useEffect, useState } from "react";

export const useProgressiveImage = (src?: string) => {
  const [img, setImg] = useState<string>();

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImg(src);
    };
  }, [src]);

  return { img };
};
