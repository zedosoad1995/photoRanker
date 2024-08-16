import {
  IGetManyPictures,
  IGetPictureVotingStats,
  IPictureStats,
  IUpdatedPic,
  IUploadPermission,
  PictureRes,
} from "@/Types/picture";
import api from "./index";
import { GENDER } from "@shared/constants/user";

export const getManyPictures = async (
  queryParams: {
    userId?: string;
    hasReport?: boolean;
    belongsToMe?: boolean;
    isBanned?: boolean;
    gender?: string | null;
    minAge?: number;
    maxAge?: number;
    orderBy?: string;
    orderByDir?: string;
    limit?: number;
    cursor?: string;
    isGlobal?: boolean;
  } = { gender: GENDER.Female, isGlobal: true }
): Promise<IGetManyPictures> => {
  return api.get(
    `/pictures?${Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
  );
};

export const getPicture = async (id: string): Promise<PictureRes> => {
  return api.get(`/pictures/${id}`);
};

export const getPictureVotingStats = async (
  id: string
): Promise<IGetPictureVotingStats> => {
  return api.get(`/pictures/${id}/vote-stats`);
};

export const getPictureStats = async (id: string): Promise<IPictureStats> => {
  return api.get(`/pictures/${id}/stats`);
};

export const getUploadPermission = async (): Promise<IUploadPermission> => {
  return api.get("/pictures/upload-permission");
};

export const updateImage = async (
  id: string,
  body: Partial<{ isActive: boolean }>
): Promise<IUpdatedPic> => {
  return api.patch(`/pictures/${id}`, body);
};

export const deleteImage = async (id: string): Promise<void> => {
  return api.delete(`/pictures/${id}`);
};

export const uploadImage = async (
  image: Blob,
  filename: string,
  isGlobal: boolean = true
): Promise<Blob> => {
  const formData = new FormData();
  formData.append("image", image, filename);
  formData.append("info", JSON.stringify({ isGlobal }));

  return api.post("/pictures", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
