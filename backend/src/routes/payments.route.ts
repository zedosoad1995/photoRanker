import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";
import { createPaymentIntent, stripeWebhook } from "@/controllers/payments.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createPaymentIntentSchema } from "@/schemas/purchase/createPaymentIntent";

const router = Router();

router.post(
  "/create-payment-intent",
  checkAuth,
  checkBanned,
  checkProfileCompleted,
  checkEmailVerified,
  validateForm(createPaymentIntentSchema),
  createPaymentIntent
);

router.post("/stripe-webhook", stripeWebhook);

export default router;
