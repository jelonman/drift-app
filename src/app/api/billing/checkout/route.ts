import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe, PRICING, AppKey } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const app = body?.app as AppKey | undefined;

  if (!app || !(app in PRICING)) {
    return NextResponse.json({ error: "Unknown app" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and the four STRIPE_PRICE_* env vars on Vercel.",
      },
      { status: 503 }
    );
  }

  const priceEnvKey = `STRIPE_PRICE_${app.toUpperCase()}`;
  const priceId = process.env[priceEnvKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing ${priceEnvKey} env var. Create a recurring price in Stripe and add its ID.` },
      { status: 503 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/account?subscribed=${app}`,
    cancel_url: `${origin}/account?canceled=${app}`,
    metadata: { userId: user.id, app },
    subscription_data: {
      metadata: { userId: user.id, app },
    },
  });

  return NextResponse.json({ url: checkout.url });
}
