import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTO_KEY as string);

export const encrypt = (text: string): string => {
  return cryptr.encrypt(text);
};

export const decrypt = (text: string): string => {
  return cryptr.decrypt(text);
};
