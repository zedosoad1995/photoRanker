import { Genders } from "@shared/types/user";

export interface IPreference {
  id: string;
  contentMinAge: number;
  contentMaxAge: number | null;
  contentGender: Genders | null;
  exposureMinAge: number;
  exposureMaxAge: number | null;
  exposureGender: Genders | null;
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
  contentGender: Genders | null;
  exposureMinAge: number;
  exposureMaxAge: number | null;
  exposureGender: Genders | null;
}
