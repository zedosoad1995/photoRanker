import { Router } from "express";
import { createOne } from "@/controllers/matches.controller";
import { checkAuth } from "@/middlewares/checkAuth";

const router = Router();

router.post("/", checkAuth, createOne);

export default router;
