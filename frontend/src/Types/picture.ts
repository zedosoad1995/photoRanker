export interface IPicture {
  id: string;
  filepath: string;
  elo: number;
  numVotes: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PictureRes {
  picture: IPicture;
}

export interface IGetManyPictures {
  pictures: IPicture[];
}
