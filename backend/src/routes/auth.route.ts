import { Router } from "express";
import {
  forgotPassword,
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
import { checkAuth } from "@/middlewares/checkAuth";
import { forgotPasswordSchema } from "@/schemas/auth/forgotPassword";

const router = Router();

router.post("/login", validateForm(signInSchema), signIn);
router.post("/login/google", validateForm(signInGoogleSchema), signInGoogle);
router.post(
  "/login/facebook",
  validateForm(signInFacebookSchema),
  signInFacebook
);
router.post("/logout", signOut);
router.post("/resend-email", checkAuth, resendEmail);
router.post("/verification/:token", verifyEmail);
router.post("/forgot-password", validateForm(forgotPasswordSchema), forgotPassword);

export default router;
