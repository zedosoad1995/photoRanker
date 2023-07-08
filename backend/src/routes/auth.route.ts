import { Router } from "express";
import { signIn, signOut } from "@/controllers/auth.controller";
import { validateForm } from "@/middlewares/validateForm";
import { signInSchema } from "@/schemas/auth/signIn";

const router = Router();

router.post("/login", validateForm(signInSchema), signIn);
router.post("/logout", signOut);

export default router;
