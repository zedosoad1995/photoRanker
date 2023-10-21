import Select from "@/Components/Select";
import { Mode } from "@/Constants/mode";

interface IModeSelect {
  mode: (typeof Mode)[keyof typeof Mode];
  handleUpdateMode: (mode: (typeof Mode)[keyof typeof Mode]) => void;
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
