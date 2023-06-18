import { Router } from "express";
import { upload } from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { storeImage } from "@/middlewares/storeImage";

const router = Router();

router.post("/", checkAuth, storeImage, upload);

export default router;
