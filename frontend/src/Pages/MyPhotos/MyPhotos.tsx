import { useState } from "react";
import { ModeSelect } from "./ModeSelect";
import GlobalMode from "./GlobalMode";
import { IMode, Mode } from "@/Constants/mode";
import PersonalMode from "./PersonalMode";
import { IPictureWithPercentile } from "@/Types/picture";

export default function MyPhotos() {
  const [picUrlsGlobal, setPicUrlsGlobal] = useState<string[]>([]);
  const [picsInfoGlobal, setPicsInfoGlobal] = useState<IPictureWithPercentile[]>([]);
  const [isSetGlobal, setIsSetGlobal] = useState(false);
  const [picUrlsPersonal, setPicUrlsPersonal] = useState<string[]>([]);
  const [picsInfoPersonal, setPicsInfoPersonal] = useState<IPictureWithPercentile[]>([]);
  const [isSetPersonal, setIsSetPersonal] = useState(false);
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
        {mode === Mode.Global && (
          <GlobalMode
            picUrls={picUrlsGlobal}
            picsInfo={picsInfoGlobal}
            setPicUrls={setPicUrlsGlobal}
            setPicsInfo={setPicsInfoGlobal}
            isSet={isSetGlobal}
            setIsSet={setIsSetGlobal}
          />
        )}
        {mode === Mode.Personal && (
          <PersonalMode
            picUrls={picUrlsPersonal}
            picsInfo={picsInfoPersonal}
            setPicUrls={setPicUrlsPersonal}
            setPicsInfo={setPicsInfoPersonal}
            isSet={isSetPersonal}
            setIsSet={setIsSetPersonal}
          />
        )}
      </div>
    </>
  );
}
