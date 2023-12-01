import { Router } from "express";
import {
  checkUploadPermission,
  deleteOne,
  getMany,
  getOne,
  updateOne,
  uploadOne,
} from "@/controllers/pictures.controller";
import { convertFormDataToBuffer } from "@/middlewares/convertFormDataToBuffer";
import { validateImage } from "@/middlewares/validateImage";
import { validateQuery } from "@/middlewares/validateQuery";
import { validateForm } from "@/middlewares/validateForm";
import { mainStorageInteractor } from "@/container";
import { getManyPicturesSchema } from "@/schemas/picture/query/getManyPictures";
import { createPictureSchema } from "@/schemas/picture/createPicture";
import { validateFormDataJson } from "@/middlewares/validateFormDataJson";
import { checkBasicUserSettings } from "@/middlewares/checkBasicUserSetting";
import { updatePictureSchema } from "@/schemas/picture/updatePicture";

const router = Router();

router.get(
  "/",
  checkBasicUserSettings,
  // @ts-ignore
  validateQuery(getManyPicturesSchema),
  getMany(mainStorageInteractor)
);

router.get("/upload-permission", checkBasicUserSettings, checkUploadPermission);

router.get("/:pictureId", checkBasicUserSettings, getOne(mainStorageInteractor));

router.post(
  "/",
  checkBasicUserSettings,
  convertFormDataToBuffer,
  validateFormDataJson(createPictureSchema, "info"),
  validateImage(mainStorageInteractor),
  uploadOne(mainStorageInteractor)
);

router.patch(
  "/:pictureId",
  checkBasicUserSettings,
  validateForm(updatePictureSchema),
  updateOne(mainStorageInteractor)
);

router.delete("/:pictureId", checkBasicUserSettings, deleteOne(mainStorageInteractor));

export default router;
