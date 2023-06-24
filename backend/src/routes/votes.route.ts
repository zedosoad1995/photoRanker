import { Router } from "express";
import { vote } from "@/controllers/votes.controller";
import { checkAuth } from "@/middlewares/checkAuth";

const router = Router();

router.post("/", checkAuth, vote);

export default router;
