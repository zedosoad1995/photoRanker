import { IMode } from "@/Constants/mode";
import { IPictureWithPercentile } from "@/Types/picture";
import { SetStateAction, createContext, useContext, useState } from "react";

type IPicUrls = {
  [k in IMode]?: string[] | undefined;
};

type IPicsInfo = {
  [k in IMode]?: IPictureWithPercentile[];
};

type INextCursor = {
  [k in IMode]?: string;
};

interface IPhotosContext {
  picUrls: IPicUrls;
  setPicUrls: React.Dispatch<React.SetStateAction<IPicUrls>>;
  picsInfo: IPicsInfo;
  setPicsInfo: React.Dispatch<React.SetStateAction<IPicsInfo>>;
  nextCursor: INextCursor;
  setNextCursor: React.Dispatch<SetStateAction<INextCursor>>;
}

const initValues: IPhotosContext = {
  picsInfo: {},
  picUrls: {},
  nextCursor: {},
  setPicsInfo: () => {},
  setPicUrls: () => {},
  setNextCursor: () => {},
};

const MyPhotosContext = createContext<IPhotosContext>(initValues);

interface IPhotosProvider {
  children: React.ReactNode;
}

export const PhotosProvider = ({ children }: IPhotosProvider) => {
  const [picUrls, setPicUrls] = useState<IPicUrls>({});
  const [picsInfo, setPicsInfo] = useState<IPicsInfo>({});
  const [nextCursor, setNextCursor] = useState<INextCursor>({});

  return (
    <MyPhotosContext.Provider
      value={{
        picsInfo,
        picUrls,
        setPicsInfo,
        setPicUrls,
        nextCursor,
        setNextCursor,
      }}
    >
      {children}
    </MyPhotosContext.Provider>
  );
};

export const usePhotos = (mode: IMode) => {
  const {
    picUrls,
    picsInfo,
    setPicUrls,
    setPicsInfo,
    nextCursor,
    setNextCursor,
  } = useContext(MyPhotosContext);

  const picUrlsMode = picUrls[mode];
  const picsInfoMode = picsInfo[mode];
  const nextCursorMode = nextCursor[mode];

  function setModeFunction<T extends { [k in IMode]?: any }>(
    setFunction: React.Dispatch<SetStateAction<T>>
  ) {
    return (value: SetStateAction<T[keyof T]>) => {
      if (typeof value === "function") {
        const func = value as (prevState: T[keyof T]) => T[keyof T];
        setFunction((prev) => ({ ...prev, [mode]: func(prev[mode]) }));
      } else {
        setFunction((prev) => ({ ...prev, [mode]: value }));
      }
    };
  }

  return {
    picUrls: picUrlsMode,
    picsInfo: picsInfoMode,
    nextCursor: nextCursorMode,
    setPicUrls: setModeFunction(setPicUrls),
    setPicsInfo: setModeFunction(setPicsInfo),
    setNextCursor: setModeFunction(setNextCursor),
  };
};
