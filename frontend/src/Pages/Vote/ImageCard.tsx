import { ImageSkeleton } from "@/Components/Skeletons/ImageSkeleton";
import { useProgressiveImage } from "@/Hooks/useProgressiveImage";
import { useState } from "react";

export const ImageCard = ({
  className,
  pic,
  onClick,
  prob,
  id,
  hasVoted,
  style,
  isLoading,
  rerender,
}: {
  className: string;
  pic: string | undefined;
  onClick: () => void;
  prob: number | undefined;
  id?: string;
  hasVoted: boolean;
  style?: React.CSSProperties;
  isLoading: boolean;
  rerender: boolean;
}) => {
  const { img } = useProgressiveImage(pic, !isLoading);

  const [isImageHovered, setIsImageHovered] = useState(false);

  const divClass = `${className} text-white font-bold text-xl]`;

  return (
    <>
      {img && (
        <div
          id={id}
          onClick={onClick}
          className={divClass}
          style={{
            backgroundImage: `${
              hasVoted ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))," : ""
            } url(${img})`,
            backgroundSize: isImageHovered ? "101%" : "100%",
            transition: "background-size 0.3s ease",
            ...style,
          }}
          onMouseEnter={() => {
            setIsImageHovered(true);
          }}
          onMouseLeave={() => {
            setIsImageHovered(false);
          }}
        >
          {hasVoted ? `${prob?.toFixed(1)}%` : ""}
        </div>
      )}
      {!img && <ImageSkeleton divClass={divClass} style={style} />}
    </>
  );
};
