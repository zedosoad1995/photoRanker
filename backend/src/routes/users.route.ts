import { Router } from "express";
import {
  createOne,
  getMany,
  getOne,
  updateOne,
} from "@/controllers/users.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createUserSchema } from "@/schemas/user/createUser";
import { updateUserSchema } from "@/schemas/user/updateUser";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkAdmin } from "@/middlewares/checkAdmin";

const router = Router();

router.get("/", checkAuth, checkAdmin, getMany);
router.get("/:userId", checkAuth, getOne);

router.post("/", validateForm(createUserSchema), createOne);
router.patch(
  "/:userId",
  checkAuth,
  checkAdmin,
  validateForm(updateUserSchema),
  updateOne
);

export default router;
