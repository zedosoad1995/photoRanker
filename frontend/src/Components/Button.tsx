interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
  isFull?: boolean;
  style?: "primary" | "secondary";
}

export default function Button({
  children,
  type,
  onClick,
  size = "medium",
  isFull = true,
  style = "primary",
}: IButton) {
  return (
    <button
      type={type}
      className={`flex justify-center rounded-md font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      } ${isFull ? "w-full" : ""} ${
        style === "primary"
          ? "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary shadow-sm"
          : "hover:bg-light-contour"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
