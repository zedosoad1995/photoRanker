import { Router } from "express";
import { createOne, getMany } from "@/controllers/users.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createUserSchema } from "@/schemas/user/createUser";

const router = Router();

router.get("/", getMany);

router.post("/", validateForm(createUserSchema), createOne);

export default router;
