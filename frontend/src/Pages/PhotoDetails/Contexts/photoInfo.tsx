import { IPictureStats, IPictureVotingStats } from "@/Types/picture";
import { createContext, useContext, useState } from "react";

interface IPhotoInfoContext {
  voteStats: IPictureVotingStats[] | undefined;
  setVoteStats: React.Dispatch<
    React.SetStateAction<IPictureVotingStats[] | undefined>
  >;
  picStats: IPictureStats | undefined;
  setPicStats: React.Dispatch<React.SetStateAction<IPictureStats | undefined>>;
}
const PhotoInfoContext = createContext<IPhotoInfoContext>({
  voteStats: undefined,
  setVoteStats: () => {},
  picStats: undefined,
  setPicStats: () => {},
});

interface IPhotoInfoProvider {
  children: React.ReactNode;
}

export const PhotoInfoProvider = ({ children }: IPhotoInfoProvider) => {
  const [voteStats, setVoteStats] = useState<IPictureVotingStats[]>();
  const [picStats, setPicStats] = useState<IPictureStats>();

  return (
    <PhotoInfoContext.Provider
      value={{ voteStats, setVoteStats, picStats, setPicStats }}
    >
      {children}
    </PhotoInfoContext.Provider>
  );
};

export const usePhotoInfo = () => useContext(PhotoInfoContext);
