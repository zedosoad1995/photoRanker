import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";

const router = Router();

router.post(
  "/create-payment-intent",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified
);

export default router;
