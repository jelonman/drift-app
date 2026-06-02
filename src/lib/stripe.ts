import Stripe from "stripe";
import { prisma } from "./db";

const key = process.env.STRIPE_SECRET_KEY;

let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!key) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export const PRICING = {
  a: {
    name: "Three Dots Pro",
    description: "Unlimited reply options and coaching for any text you dread sending.",
    price: 700,
    interval: "month" as const,
    free: 5,
    freeUnit: "conversations / month",
  },
  b: {
    name: "Tag In Family",
    description: "Unlimited drops, multi-device sync, and 30-day conversation history.",
    price: 900,
    interval: "month" as const,
    free: 14,
    freeUnit: "days free trial",
  },
  c: {
    name: "Tonight Unlimited",
    description: "Unlimited weekly meal plans, history of what you cooked, and pantry memory.",
    price: 500,
    interval: "month" as const,
    free: 3,
    freeUnit: "plans / month",
  },
  d: {
    name: "Still Here Plus",
    description: "Unlimited friends, daily nudges, and personal openers on demand.",
    price: 500,
    interval: "month" as const,
    free: 3,
    freeUnit: "friends free",
  },
} as const;

export type AppKey = keyof typeof PRICING;

export function getFreeLimit(app: AppKey) {
  return PRICING[app].free;
}

export function isStripeConfigured() {
  return Boolean(key);
}

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";

export async function getSubscriptionFor(userId: string, app: AppKey) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, app, status: { in: ["active", "trialing", "past_due"] } },
    orderBy: { createdAt: "desc" },
  });
  return sub;
}

export async function isAppActive(userId: string, app: AppKey): Promise<boolean> {
  const sub = await getSubscriptionFor(userId, app);
  if (sub) return true;
  return false;
}
