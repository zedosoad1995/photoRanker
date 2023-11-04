import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntent = async (req: Request, res: Response) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
  });

  res.status(200).send({ clientSecret: paymentIntent.client_secret });
};
