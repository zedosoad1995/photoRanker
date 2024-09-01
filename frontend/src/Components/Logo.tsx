import { useNavigate } from "react-router-dom";
import { PiScanSmileyFill } from "react-icons/pi";
import { IconContext } from "react-icons";

interface ILogo {
  navigatePath?: string;
  color?: "normal" | "contrast";
  hideIcon?: boolean;
}

export default function Logo({ navigatePath, color, hideIcon }: ILogo) {
  const navigate = useNavigate();

  let className =
    "text-2xl min-[300px]:text-3xl font-oswald font-semibold cursor-pointer flex items-center justify-center gap-1";
  if (color === "contrast") {
    className += " text-white";
  }

  return (
    <div
      onClick={() => {
        if (navigatePath) navigate(navigatePath);
      }}
      className={className}
    >
      {!hideIcon && (
        <IconContext.Provider
          value={{ color: color === "contrast" ? "yellow" : "" }}
        >
          <PiScanSmileyFill />
        </IconContext.Provider>
      )}
      Photo Scorer
    </div>
  );
}
