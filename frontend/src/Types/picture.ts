export interface IPicture {
  id: string;
  filepath: string;
  elo: number;
  numVotes: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPictureWithPercentile {
  id: string;
  filepath: string;
  elo: number;
  percentile: number;
  numVotes: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PictureRes {
  picture: IPicture;
}

export interface IGetManyPictures {
  pictures: IPictureWithPercentile[];
}
