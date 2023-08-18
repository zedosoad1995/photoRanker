import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTO_KEY as string);

export const encrypt = (text: string): string => {
  return cryptr.encrypt(text);
};

export const decrypt = (text: string): string => {
  return cryptr.decrypt(text);
};

export const toBase64 = (text: string): string => {
  return Buffer.from(text).toString("base64");
};

export const base64ToString = (text: string): string => {
  return Buffer.from(text, "base64").toString("utf8");
};
