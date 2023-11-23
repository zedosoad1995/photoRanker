import { Router } from "express";
import { checkAuth } from "@/middlewares/checkAuth";
import { checkProfileCompleted } from "@/middlewares/checkProfileCompleted";
import { checkEmailVerified } from "@/middlewares/checkEmailVerified";
import { checkBanned } from "@/middlewares/checkBanned";
import {
  createPaymentIntentIncreasePhotos,
  createPaymentIntentUnlimitedVotes,
  createPaymentIntentMultipleUnlimitedVotes,
  stripeWebhook,
} from "@/controllers/payments.controller";
import { validateForm } from "@/middlewares/validateForm";
import { createPaymentIntentMultipleUnlimitedVotesSchema } from "@/schemas/purchase/createPaymentIntentMultipleUnlimitedVotes";

const router = Router();

const profileChecks = [checkAuth, checkBanned, checkProfileCompleted, checkEmailVerified];

router.post(
  "/create-payment-intent/increase-photos",
  ...profileChecks,
  createPaymentIntentIncreasePhotos
);

router.post(
  "/create-payment-intent/unlimited-votes",
  ...profileChecks,
  createPaymentIntentUnlimitedVotes
);

router.post(
  "/create-payment-intent/multiple-unlimited-votes",
  ...profileChecks,
  validateForm(createPaymentIntentMultipleUnlimitedVotesSchema),
  createPaymentIntentMultipleUnlimitedVotes
);

router.post("/stripe-webhook", stripeWebhook);

export default router;
