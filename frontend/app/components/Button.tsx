interface IButton {
  children: React.ReactNode;
  type?: "button" | "reset" | "submit";
}

export default function Button({ children, type }: IButton) {
  return (
    <button
      type={type}
      className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {children}
    </button>
  );
}
