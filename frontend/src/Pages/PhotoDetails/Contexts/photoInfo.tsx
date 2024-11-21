import { IPictureStats, IPictureVotingStats } from "@/Types/picture";
import { createContext, useContext, useState } from "react";

interface IPhotoInfoContext {
  totalVotes: number;
  setTotalVotes: React.Dispatch<React.SetStateAction<number>>;
  hasMoreVotes: boolean;
  setHasMoreVotes: React.Dispatch<React.SetStateAction<boolean>>;
  voteStats: IPictureVotingStats[] | undefined;
  setVoteStats: React.Dispatch<
    React.SetStateAction<IPictureVotingStats[] | undefined>
  >;
  picStats: IPictureStats | undefined;
  setPicStats: React.Dispatch<React.SetStateAction<IPictureStats | undefined>>;
}
const PhotoInfoContext = createContext<IPhotoInfoContext>({
  totalVotes: 0,
  setTotalVotes: () => {},
  hasMoreVotes: false,
  setHasMoreVotes: () => {},
  voteStats: undefined,
  setVoteStats: () => {},
  picStats: undefined,
  setPicStats: () => {},
});

interface IPhotoInfoProvider {
  children: React.ReactNode;
}

export const PhotoInfoProvider = ({ children }: IPhotoInfoProvider) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasMoreVotes, setHasMoreVotes] = useState(false);
  const [voteStats, setVoteStats] = useState<IPictureVotingStats[]>();
  const [picStats, setPicStats] = useState<IPictureStats>();

  return (
    <PhotoInfoContext.Provider
      value={{
        voteStats,
        setVoteStats,
        picStats,
        setPicStats,
        hasMoreVotes,
        setHasMoreVotes,
        setTotalVotes,
        totalVotes,
      }}
    >
      {children}
    </PhotoInfoContext.Provider>
  );
};

export const usePhotoInfo = () => useContext(PhotoInfoContext);
