import api from "./index";
import { ICreateUser } from "../../../backend/src/schemas/user/createUser";
import { ICreateProfile } from "../../../backend/src/schemas/user/createProfile";
import { ISignIn } from "../../../backend/src/schemas/auth/signIn";
import {
  ICheckEmailRes,
  ICreateRes,
  IGetMeRes,
} from "../../../backend/src/types/user";
import { ILoginRes } from "../../../backend/src/types/auth";

export const login = async (data: ISignIn): Promise<ILoginRes> => {
  return api.post("/auth/login", data);
};

export const loginGoogle = async (code: string): Promise<ILoginRes> => {
  return api.post("/auth/login/google", { code });
};

export const loginFacebook = async (code: string): Promise<ILoginRes> => {
  return api.post("/auth/login/facebook", { code });
};

export const logout = async (): Promise<void> => {
  return api.post("/auth/logout");
};

export const register = async (data: ICreateUser): Promise<ICreateRes> => {
  return api.post("/users", data);
};

export const createProfile = async (
  userId: string,
  data: ICreateProfile
): Promise<ICreateRes> => {
  return api.patch(`/users/profile/${userId}`, data);
};

export const checkEmailExists = async (
  email: string
): Promise<ICheckEmailRes> => {
  return api.post("/users/check-email", { email });
};

export const getMe = async (): Promise<IGetMeRes> => {
  return api.get("/users/me");
};
