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

const router = Router();

router.get("/", checkAuth, validateQuery(getManyPicturesSchema), getMany);
router.get("/image/:imagePath", checkAuth, getImageFile);
router.get("/:pictureId", checkAuth, getOne);
router.post("/", checkAuth, convertFormDataToBuffer, validateImage, uploadOne);
router.delete("/:pictureId", checkAuth, deleteOne);

export default router;
