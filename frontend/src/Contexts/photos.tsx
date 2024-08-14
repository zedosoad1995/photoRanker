import { IMode } from "@/Constants/mode";
import { IPictureWithPercentile } from "@/Types/picture";
import { SetStateAction, createContext, useContext, useState } from "react";

type IPicUrls = {
  [k in IMode]?: string[];
};

type IPicsInfo = {
  [k in IMode]?: IPictureWithPercentile[];
};

interface IPhotosContext {
  picUrls: IPicUrls;
  setPicUrls: React.Dispatch<React.SetStateAction<IPicUrls>>;
  picsInfo: IPicsInfo;
  setPicsInfo: React.Dispatch<React.SetStateAction<IPicsInfo>>;
}

const initValues: IPhotosContext = {
  picsInfo: {},
  picUrls: {},
  setPicsInfo: () => {},
  setPicUrls: () => {},
};

const MyPhotosContext = createContext<IPhotosContext>(initValues);

interface IPhotosProvider {
  children: React.ReactNode;
}

export const PhotosProvider = ({ children }: IPhotosProvider) => {
  const [picUrls, setPicUrls] = useState<IPicUrls>({});
  const [picsInfo, setPicsInfo] = useState<IPicsInfo>({});

  return (
    <MyPhotosContext.Provider
      value={{ picsInfo, picUrls, setPicsInfo, setPicUrls }}
    >
      {children}
    </MyPhotosContext.Provider>
  );
};

export const usePhotos = (mode: IMode) => {
  const { picUrls, picsInfo, setPicUrls, setPicsInfo } =
    useContext(MyPhotosContext);

  const picUrlsMode = picUrls[mode];
  const picsInfoMode = picsInfo[mode];

  const setPicUrlsMode = (value: SetStateAction<string[] | undefined>) => {
    if (typeof value === "function") {
      setPicUrls((prev) => ({ ...prev, [mode]: value(prev[mode]) }));
    } else {
      setPicUrls((prev) => ({ ...prev, [mode]: value }));
    }
  };

  const setPicsInfoMode = (
    value: SetStateAction<IPictureWithPercentile[] | undefined>
  ) => {
    if (typeof value === "function") {
      setPicsInfo((prev) => ({ ...prev, [mode]: value(prev[mode]) }));
    } else {
      setPicsInfo((prev) => ({ ...prev, [mode]: value }));
    }
  };

  return {
    picUrls: picUrlsMode,
    picsInfo: picsInfoMode,
    setPicUrls: setPicUrlsMode,
    setPicsInfo: setPicsInfoMode,
  };
};
