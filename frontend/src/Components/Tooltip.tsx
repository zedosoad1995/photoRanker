import { useState, useEffect, useRef } from "react";

interface ITooltip {
  children: React.ReactNode | ((props: { isTouching?: boolean }) => React.ReactNode) | null;
  tooltipText: React.ReactNode;
}

export const Tooltip = ({ children, tooltipText }: ITooltip) => {
  const [isTouching, setIsTouching] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkBoundaries = () => {
      if (!tooltipRef.current) return;

      const rect = tooltipRef.current.getBoundingClientRect();

      const widths = [document.body.clientWidth];
      if (window.screen?.width) {
        widths.push(window.screen?.width);
      }
      const windowWidth = Math.min(...widths);

      if (rect.right > windowWidth) {
        tooltipRef.current.style.transform = `translateX(${-(
          rect.right -
          windowWidth +
          rect.width / 2 +
          7
        )}px) translateY(4px)`;

        tooltipRef.current.style.left = "50%";
      } else if (rect.left < 0) {
        tooltipRef.current.style.transform = `translateX(${-(
          rect.width / 2 +
          rect.left -
          7
        )}px) translateY(4px)`;
        tooltipRef.current.style.left = "50%";
      }
    };

    window.addEventListener("resize", checkBoundaries);
    checkBoundaries();
    return () => window.removeEventListener("resize", checkBoundaries);
  }, []);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!tooltipText) return;

        setIsTouching(true);
      }}
      onMouseLeave={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(false);
      }}
      onTouchStart={(event: React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!tooltipText) return;

        setIsTouching(true);
      }}
      onTouchEnd={(event: React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsTouching(false);
      }}
    >
      {typeof children === "function" ? children({ isTouching }) : children}
      <div
        ref={tooltipRef}
        className={`z-50 absolute ${
          isTouching ? "visible" : "invisible"
        } p-2 -translate-x-1/2 left-1/2 translate-y-1 bg-normal-text opacity-90 text-white rounded-lg font-normal w-52`}
      >
        {tooltipText}
      </div>
    </div>
  );
};
