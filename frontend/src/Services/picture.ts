import api from "./index";

export const getManyPics = async (): Promise<any> => {
  return api.get("/pictures");
};

export const getImage = async (imagePath: string): Promise<any> => {
  return api.get(`/pictures/image/${imagePath}`, { responseType: "blob" });
};
