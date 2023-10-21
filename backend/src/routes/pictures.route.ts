import { Router } from "express";
import { deleteOne, getMany, getOne, uploadOne } from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { convertFormDataToBuffer } from "@/middlewares/convertFormDataToBuffer";
import { validateImage } from "@/middlewares/validateImage";
import { validateQuery } from "@/middlewares/validateQuery";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { mainStorageInteractor } from "@/container";
import { checkBanned } from "@/middlewares/checkBanned";
import { getManyPicturesSchema } from "@/schemas/picture/query/getManyPictures";
import { validateForm } from "@/middlewares/validateForm";
import { createPictureSchema } from "@/schemas/picture/createPicture";
import { validateFormDataJson } from "@/middlewares/validateFormDataJson";

const router = Router();

router.get(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  // @ts-ignore
  validateQuery(getManyPicturesSchema),
  getMany(mainStorageInteractor)
);

router.get(
  "/:pictureId",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  getOne(mainStorageInteractor)
);
router.post(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  convertFormDataToBuffer,
  validateFormDataJson(createPictureSchema, "info"),
  validateImage(mainStorageInteractor),
  uploadOne(mainStorageInteractor)
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
