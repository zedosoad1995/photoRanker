import { Router } from "express";
import {
  deleteOne,
  getMany,
  getOne,
  getOneImage,
  uploadOne,
} from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { storeImage } from "@/middlewares/storeImage";

const router = Router();

router.get("/", checkAuth, getMany);
router.get("/image/:imagePath", checkAuth, getOneImage);
router.get("/:pictureId", checkAuth, getOne);
router.post("/", checkAuth, storeImage, uploadOne);
router.delete("/:pictureId", checkAuth, deleteOne);

export default router;
