import { useEffect, useState } from "react";

export const useProgressiveImage = (src?: string, canLoadNew = true) => {
  const [img, setImg] = useState<string>();

  useEffect(() => {
    if (!src) return;

    if (!canLoadNew) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImg(src);
    };
  }, [src, canLoadNew]);

  return { img };
};
