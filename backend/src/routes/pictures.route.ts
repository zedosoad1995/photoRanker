import multer from "multer";
import { Router } from "express";
import { upload } from "@/controllers/pictures.controller";
import { validateForm } from "@/middlewares/validateForm";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkAdmin } from "@/middlewares/checkAdmin";

const router = Router();

const uploadMiddleware = multer({ dest: "storage/" });

router.post("/", checkAuth, uploadMiddleware.single("image"), upload);

export default router;
