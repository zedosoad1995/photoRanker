import { COUNTRIES, ETHNICITY, GENDER } from "../constants/user";

export type Genders = (typeof GENDER)[keyof typeof GENDER];
export type Countries = (typeof COUNTRIES)[number];
export type Ethnicities = (typeof ETHNICITY)[number];
