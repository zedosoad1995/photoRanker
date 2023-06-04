import { Router } from "express";
import { createOne, getMany } from "@/controllers/users.controller";

const router = Router();

router.get("/", getMany);

router.post("/", createOne);

export default router;
