import api from ".";
import { ICreateUser } from "../../../backend/src/schemas/user/createUser";
import { ISignIn } from "../../../backend/src/schemas/auth/signIn";
import { ICheckEmailRes, ICreateRes } from "../../../backend/src/types/user";
import { ILoginRes } from "../../../backend/src/types/auth";

export const login = async (data: ISignIn): Promise<ILoginRes> => {
  return api.post("/auth", data);
};

export const register = async (data: ICreateUser): Promise<ICreateRes> => {
  return api.post("/users", data);
};

export const checkEmailExists = async (
  email: string
): Promise<ICheckEmailRes> => {
  return api.post("/users/check-email", { email });
};
