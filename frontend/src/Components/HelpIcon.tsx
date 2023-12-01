import { IconContext } from "react-icons";
import { MdHelp } from "react-icons/md";
import { Tooltip } from "./Tooltip";

interface IHelpIcon {
  size?: number;
  tooltipText: string | React.ReactNode;
}

export const HelpIcon = ({ size = 18, tooltipText }: IHelpIcon) => {
  return (
    <Tooltip tooltipText={tooltipText}>
      {({ isTouching }) => (
        <IconContext.Provider
          value={{ color: isTouching ? "#111827" : "#70747D", size: `${size}px` }}
        >
          <MdHelp />
        </IconContext.Provider>
      )}
    </Tooltip>
  );
};
