import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";
import { createPaymentIntent } from "@/controllers/payments.controller";

const router = Router();

router.post(
  "/create-payment-intent",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  createPaymentIntent
);

export default router;
