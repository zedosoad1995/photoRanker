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

export const hashStringToNormalizedFloat = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
  }
  return (hash >>> 0) / 0xFFFFFFFF; // Normalize to range [0, 1]
}