import { Router } from "express";
import {
  deleteOne,
  getMany,
  getOne,
  getImageFile,
  uploadOne,
} from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { convertFormDataToBuffer } from "@/middlewares/convertFormDataToBuffer";
import { validateImage } from "@/middlewares/validateImage";
import { validateQuery } from "@/middlewares/validateQuery";
import { getManyPicturesSchema } from "@/schemas/user/query/getManyPictures";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { mainStorageInteractor } from "@/container";
import { checkBanned } from "@/middlewares/checkBanned";

const router = Router();

router.get(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  validateQuery(getManyPicturesSchema),
  getMany
);
router.get(
  "/image/:imagePath",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  getImageFile(mainStorageInteractor)
);
router.get(
  "/:pictureId",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  getOne
);
router.post(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  convertFormDataToBuffer,
  validateImage(mainStorageInteractor),
  uploadOne
);
router.delete(
  "/:pictureId",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  deleteOne(mainStorageInteractor)
);

export default router;
