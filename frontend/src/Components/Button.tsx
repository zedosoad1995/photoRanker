interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
  isFull?: boolean;
  style?: "primary" | "secondary" | "none";
  disabled?: boolean;
}

export default function Button({
  children,
  type,
  onClick,
  size = "medium",
  isFull = true,
  style = "primary",
  disabled = false,
}: IButton) {
  let className = "";

  switch (style) {
    case "primary":
      className =
        "text-white shadow-sm " +
        (disabled
          ? "bg-[#cac7fe] text-[#4038ca] opacity-50"
          : "bg-primary hover:bg-primary-hover focus-visible:outline-primary");
      break;
    case "secondary":
      className =
        "shadow-sm " +
        (disabled
          ? "bg-[#4038ca] text-[#4038ca] opacity-50"
          : "border border-[#4038ca] text-[#4038ca] hover:bg-[#efeeff]");
      break;
    case "none":
    default:
      className = disabled ? "text-disabled-button-text" : "hover:bg-light-contour";
  }

  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex justify-center rounded-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      } ${isFull ? "w-full" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
