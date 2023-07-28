import { Router } from "express";
import { createOne } from "@/controllers/matches.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";

const router = Router();

router.post("/", checkAuth, checkProfileCompleted, createOne);

export default router;
