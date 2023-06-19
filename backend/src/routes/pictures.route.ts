import { Router } from "express";
import { deleteOne, upload } from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { storeImage } from "@/middlewares/storeImage";

const router = Router();

router.post("/", checkAuth, storeImage, upload);
router.delete("/", checkAuth, deleteOne);

export default router;
