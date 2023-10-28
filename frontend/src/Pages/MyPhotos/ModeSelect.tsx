import { IMode, Mode } from "@/Constants/mode";

interface IModeSelect {
  mode: IMode;
  handleUpdateMode: (mode: IMode) => void;
}

export const ModeSelect = ({ mode, handleUpdateMode }: IModeSelect) => {
  return (
    <div className="bg-light-contour rounded-lg flex gap-1 p-1 w-full sm:w-fit text-sm">
      <button
        onClick={() => {
          handleUpdateMode(Mode.Global);
        }}
        className={`py-2 px-4 rounded-md flex-1 sm:flex-auto ${
          mode === Mode.Global ? "bg-white font-semibold" : ""
        }`}
      >
        Global Comparison
      </button>
      <button
        onClick={() => {
          handleUpdateMode(Mode.Personal);
        }}
        className={`py-2 px-4 rounded-md flex-1 sm:flex-auto ${
          mode === Mode.Personal ? "bg-white font-semibold" : ""
        }`}
      >
        Self-Comparison
      </button>
    </div>
  );
};
