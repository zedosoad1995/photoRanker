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
}: {
  className: string;
  pic: string | undefined;
  onClick: () => void;
  prob: number | undefined;
  id?: string;
  hasVoted: boolean;
  style?: React.CSSProperties;
}) => {
  const { img } = useProgressiveImage(pic);

  const [isImageHovered, setIsImageHovered] = useState(false);

  const divClass = `${className} text-white font-bold text-xl]`;

  return (
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
  );
};
