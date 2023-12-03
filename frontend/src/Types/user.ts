import { ROLE } from "@shared/constants/user";
import { Countries, Ethnicities, Genders } from "@shared/types/user";

export interface IUser {
  id: string;
  name: string;
  email: string;
  ethnicity: Ethnicities | null;
  countryOfOrigin: Countries | null;
  dateOfBirth: string | null;
  gender: Genders | null;
  role: (typeof ROLE)[keyof typeof ROLE];
  isProfileCompleted: boolean;
  isEmailVerified: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRes {
  user: IUser;
}

export interface ICheckEmailRes {
  exists: boolean;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  ethnicity: Ethnicities | "";
  countryOfOrigin: Countries | "";
  dateOfBirth: string;
  gender: Genders | "";
}

export type ICreateProfile = Pick<
  ICreateUser,
  "ethnicity" | "countryOfOrigin" | "dateOfBirth" | "gender"
>;
