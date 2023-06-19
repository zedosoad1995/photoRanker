import { Router } from "express";
import { deleteOne, upload } from "@/controllers/pictures.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { storeImage } from "@/middlewares/storeImage";
import { getMany } from "@/controllers/users.controller";

const router = Router();

router.post("/", checkAuth, getMany);
router.post("/", checkAuth, storeImage, upload);
router.delete("/", checkAuth, deleteOne);

export default router;
