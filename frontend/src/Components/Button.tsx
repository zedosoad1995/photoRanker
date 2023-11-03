interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
  isFull?: boolean;
  isHeightFull?: boolean;
  style?: "primary" | "danger" | "none";
  variant?: "solid" | "outline";
  disabled?: boolean;
  isLoading?: boolean;
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
  isHeightFull = false,
  isLoading = false,
}: IButton) {
  let className = "";
  let spinnerClassName = "";

  switch (style) {
    case "primary":
      if (variant === "solid") {
        spinnerClassName = "fill-white";

        className =
          "text-white shadow-sm " +
          (disabled
            ? "bg-[#cac7fe] text-[#4038ca] opacity-50"
            : "bg-primary hover:bg-primary-hover focus-visible:outline-primary");
      } else if (variant === "outline") {
        spinnerClassName = "fill-primary";

        className =
          "shadow-sm border border-[#4038ca] text-[#4038ca] " +
          (disabled ? "opacity-50" : "hover:bg-[#efeeff]");
      }

      break;
    case "danger":
      if (variant === "solid") {
        spinnerClassName = "fill-white";

        className =
          "text-white shadow-sm " +
          (disabled ? "bg-[#fccdcc] text-[#b32422] opacity-50" : "bg-[#e94c4a] hover:bg-[#d63230]");
      } else if (variant === "outline") {
        spinnerClassName = "fill-danger";

        className =
          "shadow-sm border border-danger text-danger " +
          (disabled ? "opacity-50" : "hover:bg-[#fef2f2]");
      }

      break;
    case "none":
    default:
      spinnerClassName = "fill-primary";
      className = disabled ? "text-disabled-button-text" : "hover:bg-light-contour";
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex ${
        isHeightFull ? "h-full" : ""
      } justify-center items-center rounded-md font-semibold leading-6 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      } ${isFull ? "w-full" : ""} ${className}`}
      onClick={handleClick}
    >
      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <div role="status" className="flex">
            <svg
              className={`inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-pri ${spinnerClassName}`}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          Loading...
        </div>
      )}
      {!isLoading && children}
    </button>
  );
}
