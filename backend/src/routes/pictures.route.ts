import { Router } from "express";
import {
  deleteOne,
  getMany,
  getOne,
  upload,
} from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { storeImage } from "@/middlewares/storeImage";

const router = Router();

router.get("/", checkAuth, getMany);
router.get("/:pictureId", checkAuth, getOne);
router.post("/", checkAuth, storeImage, upload);
router.delete("/:pictureId", checkAuth, deleteOne);

export default router;
