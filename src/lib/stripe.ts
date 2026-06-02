import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!key) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export const PRICING = {
  a: { name: "Three Dots Pro", price: 700, interval: "month" as const, free: 5 },
  b: { name: "Tag In Family", price: 900, interval: "month" as const, free: 14 },
  c: { name: "Tonight Unlimited", price: 500, interval: "month" as const, free: 3 },
  d: { name: "Still Here Plus", price: 500, interval: "month" as const, free: 3 },
};

export function getFreeLimit(app: keyof typeof PRICING) {
  return PRICING[app].free;
}
