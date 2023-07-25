interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
  isFull?: boolean;
  style?: "primary" | "secondary";
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
  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex justify-center rounded-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      } ${isFull ? "w-full" : ""} ${
        style === "primary"
          ? `text-white shadow-sm ${
              disabled
                ? "bg-disabled-button-bg text-disabled-button-text"
                : "bg-primary hover:bg-primary-hover focus-visible:outline-primary"
            }`
          : disabled
          ? "text-disabled-button-text"
          : "hover:bg-light-contour"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
