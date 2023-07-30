import { Router } from "express";
import {
  signIn,
  signInFacebook,
  signInGoogle,
  signOut,
} from "@/controllers/auth.controller";
import { validateForm } from "@/middlewares/validateForm";
import { signInSchema } from "@/schemas/auth/signIn";
import { signInGoogleSchema } from "@/schemas/auth/signInGoogle";
import { signInFacebookSchema } from "@/schemas/auth/signInFacebook";

const router = Router();

router.post("/login", validateForm(signInSchema), signIn);
router.post("/login/google", validateForm(signInGoogleSchema), signInGoogle);
router.post(
  "/login/facebook",
  validateForm(signInFacebookSchema),
  signInFacebook
);
router.post("/logout", signOut);

export default router;
