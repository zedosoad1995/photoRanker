import { useState } from "react";
import { ModeSelect } from "./ModeSelect";
import GlobalMode from "./GlobalMode";
import { IMode, Mode } from "@/Constants/mode";
import PersonalMode from "./PersonalMode";
import { MyPhotosProvider } from "./Contexts/myPhotos";
import { useAuth } from "@/Contexts/auth";

export default function MyPhotos() {
  const { user } = useAuth();

  const [mode, setMode] = useState<IMode>(Mode.Global);

  const handleUpdateMode = (mode: IMode) => {
    setMode(mode);
  };

  return (
    <>
      <div className="pb-4 md:pb-12 w-full md:w-[650px] lg:w-[900px] xl:w-[1150px] mx-auto">
        <div className="flex justify-center items-centers mb-3">
          <ModeSelect mode={mode} handleUpdateMode={handleUpdateMode} />
        </div>
        <MyPhotosProvider loggedUser={user} mode={Mode.Global}>
          {mode === Mode.Global && <GlobalMode />}
        </MyPhotosProvider>
        <MyPhotosProvider loggedUser={user} mode={Mode.Personal}>
          {mode === Mode.Personal && <PersonalMode />}
        </MyPhotosProvider>
      </div>
    </>
  );
}
