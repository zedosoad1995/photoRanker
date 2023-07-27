import { Router } from "express";
import {
  checkEmailExists,
  createOne,
  createProfile,
  getMany,
  getMe,
  getOne,
  updateOne,
} from "@/controllers/users.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createUserSchema } from "@/schemas/user/createUser";
import { updateUserSchema } from "@/schemas/user/updateUser";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkAdmin } from "@/middlewares/checkAdmin";
import { checkEmailExistsSchema } from "@/schemas/user/checkEmailExists";
import { createProfileSchema } from "@/schemas/user/createProfile";

const router = Router();

router.get("/", checkAuth, checkAdmin, getMany);
router.get("/me", checkAuth, getMe);
router.get("/:userId", checkAuth, getOne);

router.post("/", validateForm(createUserSchema), createOne);
router.patch("/profile/:userId", checkAuth, validateForm(createProfileSchema), createProfile);
router.patch("/:userId", checkAuth, checkAdmin, validateForm(updateUserSchema), updateOne);

router.post("/check-email", validateForm(checkEmailExistsSchema), checkEmailExists);

export default router;
