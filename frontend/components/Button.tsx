interface IButton {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "medium" | "large";
}

export default function Button({ children, type, onClick, size = "medium" }: IButton) {
  return (
    <button
      type={type}
      className={`flex w-full justify-center rounded-md bg-primary font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        size === "medium" ? "px-3 py-1.5 text-sm" : "px-5 py-2.5 text-base"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
