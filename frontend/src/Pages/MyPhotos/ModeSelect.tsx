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
        <div>You vs Others</div>
        <HelpIcon
          tooltipText={
            <>
              <b>Find how you rate againts others.</b>
              <div>
                This mode is best for you to know how attractive your pic is in relation to other
                people's.
              </div>
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
        <div>You vs Self</div>
        <HelpIcon
          tooltipText={
            <>
              <b>Find your best pic.</b>
              <div>
                The voters will be shown 2 random pics from you, and select their favourite.
              </div>
              <div>Note: you will not be competing with other people, only with yourself.</div>
            </>
          }
        />
      </button>
    </div>
  );
};
