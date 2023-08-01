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

const router = Router();

router.get(
  "/",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  validateQuery(getManyPicturesSchema),
  getMany
);
router.get(
  "/image/:imagePath",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  getImageFile
);
router.get(
  "/:pictureId",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  getOne
);
router.post(
  "/",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  convertFormDataToBuffer,
  validateImage,
  uploadOne
);
router.delete(
  "/:pictureId",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  deleteOne
);

export default router;
