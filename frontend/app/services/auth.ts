import api from ".";
import { ICreateUser } from "../../../backend/src/schemas/user/createUser";

export const register = async (data: ICreateUser) => {
  return api.post("/users", data);
};
