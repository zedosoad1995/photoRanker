import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { validateForm } from "@/middlewares/validateForm";
import { checkBanned } from "@/middlewares/checkBanned";
import { getOne, updateOne } from "@/controllers/preferences.controller";
import { updatePreferenceSchema } from "@/schemas/preference/updatePreference";

const router = Router();

router.get("/:userId", checkAuth, checkBanned, checkProfileCompleted, checkEmailVerified, getOne);

router.patch(
  "/:userId",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(updatePreferenceSchema),
  updateOne
);

export default router;
