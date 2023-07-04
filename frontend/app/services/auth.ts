import api from ".";
import { ICreateUser } from "../../../backend/src/schemas/user/createUser";
import { ICheckEmailRes, ICreateRes } from "../../../backend/src/types/user";

export const register = async (data: ICreateUser): Promise<ICreateRes> => {
  return api.post("/users", data);
};

export const checkEmailExists = async (
  email: string
): Promise<ICheckEmailRes> => {
  return api.post("/users/check-email", { email });
};
