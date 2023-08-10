import { Router } from "express";
import {
  ban,
  checkEmailExists,
  createOne,
  createProfile,
  deleteMe,
  deleteOne,
  getMany,
  getMe,
  getOne,
  unban,
  updateOne,
} from "@/controllers/users.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createUserSchema } from "@/schemas/user/createUser";
import { updateUserSchema } from "@/schemas/user/updateUser";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkAdmin } from "@/middlewares/checkAdmin";
import { checkEmailExistsSchema } from "@/schemas/user/checkEmailExists";
import { createProfileSchema } from "@/schemas/user/createProfile";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkRegular } from "@/middlewares/checkRegular";

const router = Router();

router.get("/", checkAuth, checkAdmin, checkProfileCompleted, checkEmailVerified, getMany);
router.get("/me", checkAuth, getMe);
router.get("/:userId", checkAuth, checkProfileCompleted, checkEmailVerified, getOne);

router.post("/", validateForm(createUserSchema), createOne);
router.patch("/profile/:userId", checkAuth, validateForm(createProfileSchema), createProfile);
router.patch(
  "/:userId",
  checkAuth,
  checkAdmin,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(updateUserSchema),
  updateOne
);

router.post("/check-email", validateForm(checkEmailExistsSchema), checkEmailExists);

router.delete("/me", checkAuth, checkRegular, deleteMe);
router.delete("/:userId", checkAuth, checkAdmin, deleteOne);

router.put("/ban/:userId", checkAuth, checkAdmin, checkProfileCompleted, checkEmailVerified, ban);
router.put(
  "/unban/:userId",
  checkAuth,
  checkAdmin,
  checkProfileCompleted,
  checkEmailVerified,
  unban
);

export default router;
