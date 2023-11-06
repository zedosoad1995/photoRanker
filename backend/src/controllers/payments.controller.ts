import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { User } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntent = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser as User;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: { userId: loggedUser.id },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Something went wrong with strip, client_secret was null");
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
      console.log(paymentIntentSucceeded.amount, paymentIntentSucceeded.metadata);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
