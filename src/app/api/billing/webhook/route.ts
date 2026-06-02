import { NextResponse } from "next/server";
import { getStripe, PRICING } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import {
  sendPaymentReceiptEmail,
  sendSubscriptionCanceledEmail,
} from "@/lib/email";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const app = session.metadata?.app;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;
        if (userId && app && subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscription(userId, app, sub);
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user && (app in PRICING)) {
            const appName = PRICING[app as keyof typeof PRICING].name;
            const amount = PRICING[app as keyof typeof PRICING].price;
            sendPaymentReceiptEmail(user.email, appName, amount).catch((e) =>
              console.error("[webhook] receipt email failed:", e)
            );
          }
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const app = sub.metadata?.app;
        if (userId && app) {
          await upsertSubscription(userId, app, sub);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription
          .update({
            where: { stripeSubscriptionId: sub.id },
            data: { status: "canceled", cancelAtPeriodEnd: true },
            include: { user: true },
          })
          .catch(() => null);
        if (existing && existing.user && (existing.app in PRICING)) {
          const appName = PRICING[existing.app as keyof typeof PRICING].name;
          sendSubscriptionCanceledEmail(
            existing.user.email,
            appName,
            existing.currentPeriodEnd
          ).catch((e) => console.error("[webhook] cancel email failed:", e));
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Handler error: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(userId: string, app: string, sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const firstItem = sub.items.data[0];
  const periodEndUnix = firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const periodEnd = new Date(periodEndUnix * 1000);

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    create: {
      userId,
      app,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      status: sub.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      status: sub.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}
