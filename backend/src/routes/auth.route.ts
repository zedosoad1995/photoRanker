import { Router } from "express";
import { signIn } from "@/controllers/auth.controller";
import { validateForm } from "@/middlewares/validateForm";
import { signInSchema } from "@/schemas/auth/signIn";

const router = Router();

router.post("/", validateForm(signInSchema), signIn);

export default router;
