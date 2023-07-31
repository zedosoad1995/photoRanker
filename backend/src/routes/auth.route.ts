import { Router } from "express";
import {
  resendEmail,
  signIn,
  signInFacebook,
  signInGoogle,
  signOut,
  verifyEmail,
} from "@/controllers/auth.controller";
import { validateForm } from "@/middlewares/validateForm";
import { signInSchema } from "@/schemas/auth/signIn";
import { signInGoogleSchema } from "@/schemas/auth/signInGoogle";
import { signInFacebookSchema } from "@/schemas/auth/signInFacebook";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkAuth } from "@/middlewares/checkAuth";

const router = Router();

router.post("/login", validateForm(signInSchema), signIn);
router.post("/login/google", validateForm(signInGoogleSchema), signInGoogle);
router.post(
  "/login/facebook",
  validateForm(signInFacebookSchema),
  signInFacebook
);
router.post("/logout", signOut);
router.post("/resend-email", checkAuth, checkProfileCompleted, resendEmail);
router.get("/verification/:token", verifyEmail);

export default router;
