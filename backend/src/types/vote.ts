export interface IVote {
  vote: {
    id: string;
    winnerPictureId: string;
    voterId: string;
    matchId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
