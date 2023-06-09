import bcrypt from "bcrypt";

export const hashPassowrd = async (password: string) => {
  const salt = await bcrypt.genSalt(6);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
