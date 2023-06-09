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

const router = Router();

router.get("/", getMany);
router.get("/:userId", getOne);

router.post("/", validateForm(createUserSchema), createOne);
router.patch("/:userId", validateForm(updateUserSchema), updateOne);

export default router;
