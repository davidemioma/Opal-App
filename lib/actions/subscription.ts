"use server";

import { Stripe } from "stripe";
import { stripe } from "../stripe";
import prismadb from "../prisma-db";
import { getCurrentUser } from "../data/auth";

export const createSubscription = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
    });

    if (!session) {
      return { status: 400, error: "Error connecting to Stripe. Try again." };
    }

    return {
      status: 200,
      session_url: session.url,
      customerId: session.customer,
    };
  } catch (err) {
    console.error("Stripe Payments", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};

export const completeSubscription = async (sessionId: string) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: 401, error: "Unauthorized, Youn need to sign in!" };
    }

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return { status: 404, error: "Session not found! Stripe error" };
    }

    // Update user subscription
    const subscription = await prismadb.subscription.update({
      where: {
        userId: user.id,
      },
      data: {
        plan: "PRO",
        customerId: session.customer as string,
      },
      select: {
        id: true,
      },
    });

    if (!subscription) {
      return { status: 404, error: "User currently has no subscription!" };
    }

    return { status: 200, data: subscription };
  } catch (err) {
    console.error("Stripe Complete Payments", err);

    return {
      status: 500,
      error: "Something went wrong! Internal server error.",
    };
  }
};
