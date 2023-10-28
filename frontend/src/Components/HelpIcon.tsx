import { useState, useEffect, useRef } from "react";
import { IconContext } from "react-icons";
import { MdHelp } from "react-icons/md";

interface IHelpIcon {
  size?: number;
  tooltipText: string | React.ReactNode;
}

export const HelpIcon = ({ size = 18, tooltipText }: IHelpIcon) => {
  const [isTouching, setIsTouching] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkBoundaries = () => {
      if (!tooltipRef.current) return;

      const rect = tooltipRef.current.getBoundingClientRect();

      if (rect.right > window.innerWidth) {
        tooltipRef.current.style.transform = `translateX(-${
          rect.right - window.innerWidth + rect.width / 2
        }px) translateY(4px)`;
        tooltipRef.current.style.left = "0px";
      } else if (rect.left < 0) {
        tooltipRef.current.style.transform = `translateX(-${
          rect.width / 2 + rect.left
        }px) translateY(4px)`;
        tooltipRef.current.style.left = "100%";
      }
    };

    window.addEventListener("resize", checkBoundaries);
    checkBoundaries();
    return () => window.removeEventListener("resize", checkBoundaries);
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(true);
      }}
      onMouseLeave={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(false);
      }}
      onTouchStart={(event: React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(true);
      }}
      onTouchEnd={(event: React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(false);
      }}
    >
      <IconContext.Provider
        value={{ color: isTouching ? "#111827" : "#70747D", size: `${size}px` }}
      >
        <MdHelp />
      </IconContext.Provider>
      <div
        ref={tooltipRef}
        className="z-50 absolute invisible group-hover:visible p-2 -translate-x-1/2 left-1/2 translate-y-1 bg-normal-text opacity-90 text-white rounded-lg font-normal w-52"
      >
        {tooltipText}
      </div>
    </div>
  );
};
