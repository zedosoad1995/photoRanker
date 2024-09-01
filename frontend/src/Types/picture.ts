import { IAgeGroup } from "@shared/types/picture";
import { Countries, Ethnicities, Genders } from "@shared/types/user";

export interface IUpdatedPic {
  id: string;
  url: string;
  numVotes: number;
  maxFreeVotes: number;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPictureWithPercentile {
  id: string;
  url: string;
  percentile: number | null;
  numVotes: number;
  numPaidVotes: number;
  cannotSeeAllVotes: boolean;
  isActive: boolean;
  ageGroupPercentile?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPictureStats {
  id: string;
  percentileGeneral?: number;
  percentileByAgeGroup?: number;
  percentileByEthnicity?: number;
  percentileByContinent?: number;
  numVotes: number;
  url: string;
  gender?: Genders | null;
  isActive: boolean;
  isGlobal: boolean;
  ageGroup?: IAgeGroup;
  ethnicity?: string | null;
  continent?: string;
}

export interface IPictureVotingStats {
  id: string;
  voter_gender: Genders | null;
  voter_country: Countries | null;
  voter_ethnicity: Ethnicities | null;
  voter_age: number;
  is_winner: boolean;
  winner: string | null;
  loser: string | null;
  createdAt: Date;
}

export interface IAdminPhoto {
  id: string;
  ethnicity: string | null;
  countryOfOrigin: string | null;
  url: string;
}

export interface IGetAdminPhoto {
  pictures: IAdminPhoto[];
}

export interface IGetPictureVotingStats {
  stats: IPictureVotingStats[];
  total: number;
  hasMore: boolean;
}

export interface PictureRes {
  picture: IPictureWithPercentile;
}

export interface IGetManyPictures {
  pictures: IPictureWithPercentile[];
  nextCursor?: string;
  ageGroup: IAgeGroup;
}

export interface IUploadPermission {
  canUploadMore: boolean;
}

export interface IAdminPictureBody {
  countryOfOrigin?: string;
  ethnicity?: string;
}
