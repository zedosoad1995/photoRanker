import { Router } from "express";
import { vote } from "@/controllers/votes.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { voteSchema } from "@/schemas/vote/vote";
import { validateForm } from "@/middlewares/validateForm";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";

const router = Router();

router.post("/", checkAuth, checkProfileCompleted, validateForm(voteSchema), vote);

export default router;
