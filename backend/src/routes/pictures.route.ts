import { Router } from "express";
import {
  checkUploadPermission,
  deleteOne,
  getAdminPics,
  getMany,
  getOne,
  getStats,
  getVotesStats,
  updateAdminPhoto,
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
import { checkAuth } from "@/middlewares/checkAuth";
import { updateAdminPictureSchema } from "@/schemas/picture/admin/updateAdminPicture";

const router = Router();

router.get(
  "/",
  checkBasicUserSettings,
  // @ts-ignore
  validateQuery(getManyPicturesSchema),
  getMany(glicko2, mainStorageInteractor),
);

router.get("/upload-permission", checkBasicUserSettings, checkUploadPermission);
router.get("/admin", checkAuth, checkAdmin, getAdminPics(mainStorageInteractor));

router.get("/:pictureId", checkBasicUserSettings, getOne(mainStorageInteractor));
router.get("/:pictureId/vote-stats", checkBasicUserSettings, getVotesStats(mainStorageInteractor));
router.get("/:pictureId/stats", checkBasicUserSettings, getStats(mainStorageInteractor));

router.post(
  "/",
  checkBasicUserSettings,
  convertFormDataToBuffer,
  validateFormDataJson(createPictureSchema, "info"),
  validateImage(mainStorageInteractor),
  uploadOne(mainStorageInteractor),
);

router.patch(
  "/admin/:pictureId",
  checkAuth,
  checkAdmin,
  validateForm(updateAdminPictureSchema),
  updateAdminPhoto,
);
router.patch(
  "/:pictureId",
  checkBasicUserSettings,
  validateForm(updatePictureSchema),
  updateOne(mainStorageInteractor),
);

router.delete("/:pictureId", checkBasicUserSettings, deleteOne(mainStorageInteractor));

export default router;
