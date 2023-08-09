interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
  isFull?: boolean;
  style?: "primary" | "danger" | "none";
  variant?: "solid" | "outline";
  disabled?: boolean;
}

export default function Button({
  children,
  type,
  onClick,
  size = "medium",
  isFull = true,
  style = "primary",
  variant = "solid",
  disabled = false,
}: IButton) {
  let className = "";

  switch (style) {
    case "primary":
      if (variant === "solid") {
        className =
          "text-white shadow-sm " +
          (disabled
            ? "bg-[#cac7fe] text-[#4038ca] opacity-50"
            : "bg-primary hover:bg-primary-hover focus-visible:outline-primary");
      } else if (variant === "outline") {
        className =
          "shadow-sm border border-[#4038ca] text-[#4038ca] " +
          (disabled ? "opacity-50" : "hover:bg-[#efeeff]");
      }

      break;
    case "danger":
      if (variant === "solid") {
        className =
          "text-white shadow-sm " +
          (disabled ? "bg-[#fccdcc] text-[#b32422] opacity-50" : "bg-[#e94c4a] hover:bg-[#d63230]");
      } else if (variant === "outline") {
        className =
          "shadow-sm border border-[#b32522] text-[#b32522] " +
          (disabled ? "opacity-50" : "hover:bg-[#fef2f2]");
      }

      break;
    case "none":
    default:
      className = disabled ? "text-disabled-button-text" : "hover:bg-light-contour";
  }

  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex justify-center items-center rounded-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      } ${isFull ? "w-full" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
