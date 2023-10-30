import { HelpIcon } from "@/Components/HelpIcon";
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
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 sm:flex-auto ${
          mode === Mode.Global ? "bg-white font-semibold" : ""
        }`}
      >
        <div>Global</div>
        <HelpIcon
          tooltipText={
            <>
              <div>Your pics will compete against random people.</div>
              <div>Your score determines how attractive you are compared to others.</div>
            </>
          }
        />
      </button>
      <button
        onClick={() => {
          handleUpdateMode(Mode.Personal);
        }}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 sm:flex-auto ${
          mode === Mode.Personal ? "bg-white font-semibold" : ""
        }`}
      >
        <div>Personal</div>
        <HelpIcon
          tooltipText={
            <>
              <div>Your photos only compete against eachother (not with strangers).</div>
              <div>You score (0-100) indicates which of your pics the voters prefer.</div>
            </>
          }
        />
      </button>
    </div>
  );
};
