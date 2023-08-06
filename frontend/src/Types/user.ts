import { COUNTRIES, ETHNICITY, GENDER, ROLE } from "@shared/constants/user";

export interface IUser {
  id: string;
  name: string;
  email: string;
  ethnicity: (typeof ETHNICITY)[number] | null;
  countryOfOrigin: (typeof COUNTRIES)[number] | null;
  dateOfBirth: string | null;
  gender: (typeof GENDER)[keyof typeof GENDER] | null;
  role: (typeof ROLE)[keyof typeof ROLE];
  isProfileCompleted: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRes {
  user: IUser;
}

export interface ICheckEmailRes {
  exists: boolean;
}
