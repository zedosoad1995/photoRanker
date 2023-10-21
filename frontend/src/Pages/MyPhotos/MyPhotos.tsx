import { useState } from "react";
import { ModeSelect } from "./ModeSelect";
import GlobalMode from "./GlobalMode";
import { IMode, Mode } from "@/Constants/mode";
import PersonalMode from "./PersonalMode";

export default function MyPhotos() {
  const [mode, setMode] = useState<IMode>(Mode.Global);

  const handleUpdateMode = (mode: IMode) => {
    setMode(mode);
  };

  return (
    <>
      <div className="pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
        <ModeSelect mode={mode} handleUpdateMode={handleUpdateMode} />
        {mode === Mode.Global && <GlobalMode />}
        {mode === Mode.Personal && <PersonalMode />}
      </div>
    </>
  );
}
