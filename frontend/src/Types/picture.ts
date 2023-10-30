export interface IPictureWithPercentile {
  id: string;
  url: string;
  percentile: number;
  numVotes: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PictureRes {
  picture: IPictureWithPercentile;
}

export interface IGetManyPictures {
  pictures: IPictureWithPercentile[];
  nextCursor: string | undefined;
}

export interface IUploadPermission {
  canUploadMore: boolean;
}
