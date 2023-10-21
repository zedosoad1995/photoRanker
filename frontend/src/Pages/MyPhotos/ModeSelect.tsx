import Select from "@/Components/Select";
import { IMode, Mode } from "@/Constants/mode";

interface IModeSelect {
  mode: IMode;
  handleUpdateMode: (mode: IMode) => void;
}

export const ModeSelect = ({ mode, handleUpdateMode }: IModeSelect) => {
  return (
    <div className="max-w-[180px] mb-1">
      <Select
        onChange={handleUpdateMode}
        options={[
          { id: Mode.Global, label: "Global Mode" },
          { id: Mode.Personal, label: "Personal Mode" },
        ]}
        value={mode}
      />
    </div>
  );
};
