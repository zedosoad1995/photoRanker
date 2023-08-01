import { Router } from "express";
import { createOne } from "@/controllers/matches.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkProfileCompleted,
  checkEmailVerified,
  createOne
);

export default router;
