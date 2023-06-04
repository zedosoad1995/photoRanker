import { Router } from "express";
import { getMany } from "@/controllers/users.controller";

const router = Router();

router.get("/", getMany);

export default router;
