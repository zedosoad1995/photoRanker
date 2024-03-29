import { Router } from "express";
import { vote } from "@/controllers/votes.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { voteSchema } from "@/schemas/vote/vote";
import { validateForm } from "@/middlewares/validateForm";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";
import { glicko2 } from "@/container";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(voteSchema),
  vote(glicko2)
);

export default router;
