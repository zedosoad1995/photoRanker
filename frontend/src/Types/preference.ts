import { GENDER } from "@shared/constants/user";

export interface IPreference {
  id: string;
  contentMinAge: number;
  contentMaxAge: number | null;
  contentGender: (typeof GENDER)[keyof typeof GENDER] | null;
  exposureMinAge: number;
  exposureMaxAge: number | null;
  exposureGender: (typeof GENDER)[keyof typeof GENDER] | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface IPreferenceRes {
  preference: IPreference;
}

export interface IUpdatePreferencesBody {
  contentMinAge: number;
  contentMaxAge: number | null;
  contentGender: (typeof GENDER)[keyof typeof GENDER] | null;
  exposureMinAge: number;
  exposureMaxAge: number | null;
  exposureGender: (typeof GENDER)[keyof typeof GENDER] | null;
}
