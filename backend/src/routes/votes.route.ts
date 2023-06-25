import { Router } from "express";
import { vote } from "@/controllers/votes.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { voteSchema } from "@/schemas/vote/vote";
import { validateForm } from "@/middlewares/validateForm";

const router = Router();

router.post("/", checkAuth, validateForm(voteSchema), vote);

export default router;
