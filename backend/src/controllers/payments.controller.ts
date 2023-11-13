import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { User } from "@prisma/client";
import {
  getPurchaseAmountAndMetadata,
  handlePurchase,
  hasAlreadyBeenPurchased,
} from "@/models/payment";
import { BadRequestError } from "@/errors/BadRequestError";
import { ValidationError } from "@/errors/ValidationError";
import { ILoggedUserMiddleware } from "@/types/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntent = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser as ILoggedUserMiddleware;

  const hasBeenPurchased = await hasAlreadyBeenPurchased(req.body.purchaseType, loggedUser);
  if (hasBeenPurchased) {
    throw new BadRequestError("This feature has already been purchased");
  }

  const purchaseInfo = getPurchaseAmountAndMetadata(req.body.purchaseType);

  if (!purchaseInfo) {
    throw new BadRequestError("Invalid purchaseType");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: purchaseInfo.amount,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: { userId: loggedUser.id, ...purchaseInfo.metadata },
  });

  if (!paymentIntent.client_secret) {
    throw "Something went wrong with strip, client_secret was null";
  }

  res.status(200).send({ clientSecret: paymentIntent.client_secret });
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers["stripe-signature"];

  let event;

  if (!sig || !req.rawBody) {
    return res.status(400).send(`Webhook Error: No header`);
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      "whsec_3c3fc9ee91e7f7271610a20f0590ea8091b297c977eaa77ec8cf381b4e91f2bd"
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err ? (err as any).message : "Something went wrong"}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;

      if (!paymentIntentSucceeded.metadata.userId) {
        throw new ValidationError({
          path: "metadata.userId",
          message: "Required",
        });
      } else if (!paymentIntentSucceeded.metadata.type) {
        throw new ValidationError({ path: "metadata.type", message: "Required" });
      }

      await handlePurchase(
        paymentIntentSucceeded.metadata.type,
        paymentIntentSucceeded.metadata.userId
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
