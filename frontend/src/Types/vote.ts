export interface IVote {
  id: string;
  winnerPictureId: string;
  voterId: string;
  matchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVoteRes {
  vote: IVote;
}
