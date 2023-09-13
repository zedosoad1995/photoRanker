import { Router } from "express";
import { createOne } from "@/controllers/matches.controller";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";
import { glicko2, mainStorageInteractor } from "@/container";

const router = Router();

router.post(
  "/",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  createOne(glicko2, mainStorageInteractor)
);

export default router;
