import { Router } from "express";
import {
  checkUploadPermission,
  deleteOne,
  getAdminPics,
  getMany,
  getOne,
  getStats,
  getVotesStats,
  updateOne,
  uploadOne,
} from "@/controllers/pictures.controller";
import { convertFormDataToBuffer } from "@/middlewares/convertFormDataToBuffer";
import { validateImage } from "@/middlewares/validateImage";
import { validateQuery } from "@/middlewares/validateQuery";
import { validateForm } from "@/middlewares/validateForm";
import { glicko2, mainStorageInteractor } from "@/container";
import { getManyPicturesSchema } from "@/schemas/picture/query/getManyPictures";
import { createPictureSchema } from "@/schemas/picture/createPicture";
import { validateFormDataJson } from "@/middlewares/validateFormDataJson";
import { checkBasicUserSettings } from "@/middlewares/checkBasicUserSetting";
import { updatePictureSchema } from "@/schemas/picture/updatePicture";
import { checkAdmin } from "@/middlewares/checkAdmin";

const router = Router();

router.get(
  "/",
  checkBasicUserSettings,
  // @ts-ignore
  validateQuery(getManyPicturesSchema),
  getMany(glicko2, mainStorageInteractor),
);

router.get("/upload-permission", checkBasicUserSettings, checkUploadPermission);

router.get("/:pictureId", checkBasicUserSettings, getOne(mainStorageInteractor));
router.get("/:pictureId/vote-stats", checkBasicUserSettings, getVotesStats(mainStorageInteractor));
router.get("/:pictureId/stats", checkBasicUserSettings, getStats(mainStorageInteractor));
router.get("/admin", checkAdmin, getAdminPics(mainStorageInteractor));

router.post(
  "/",
  checkBasicUserSettings,
  convertFormDataToBuffer,
  validateFormDataJson(createPictureSchema, "info"),
  validateImage(mainStorageInteractor),
  uploadOne(mainStorageInteractor),
);

router.patch(
  "/:pictureId",
  checkBasicUserSettings,
  validateForm(updatePictureSchema),
  updateOne(mainStorageInteractor),
);

router.delete("/:pictureId", checkBasicUserSettings, deleteOne(mainStorageInteractor));

export default router;
