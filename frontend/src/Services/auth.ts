import api from "./index";
import { ICreateUser } from "../../../backend/src/schemas/user/createUser";
import { ICreateProfile } from "../../../backend/src/schemas/user/createProfile";
import { ISignIn } from "../../../backend/src/schemas/auth/signIn";
import { IUserRes, ICheckEmailRes } from "@/Types/user";

export const login = async (data: ISignIn): Promise<IUserRes> => {
  return api.post("/auth/login", data);
};

export const loginGoogle = async (code: string): Promise<IUserRes> => {
  return api.post("/auth/login/google", { code });
};

export const loginFacebook = async (code: string): Promise<IUserRes> => {
  return api.post("/auth/login/facebook", { code });
};

export const logout = async (): Promise<void> => {
  return api.post("/auth/logout");
};

export const register = async (data: ICreateUser): Promise<IUserRes> => {
  return api.post("/users", data);
};

export const createProfile = async (userId: string, data: ICreateProfile): Promise<IUserRes> => {
  return api.patch(`/users/profile/${userId}`, data);
};

export const checkEmailExists = async (email: string): Promise<ICheckEmailRes> => {
  return api.post("/users/check-email", { email });
};

export const getMe = async (): Promise<IUserRes> => {
  return api.get("/users/me");
};

export const resendEmail = async (): Promise<void> => {
  return api.post("/auth/resend-email");
};

export const verifyEmail = async (token: string): Promise<void> => {
  return api.post(`/auth/verification/${token}`);
};

export const forgotPassword = async (email: string): Promise<void> => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  return api.patch(`/auth/reset-password/${token}`, { password });
};
