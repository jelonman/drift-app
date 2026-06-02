import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ForWho } from "@/components/marketing/for-who";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = {
  title: "Tonight — A week of meals from what's in your fridge",
  description:
    "List your pantry. Get five nights of meals, a grouped grocery list, and a note about which leftover feeds Tuesday lunch. It remembers what you actually ate.",
  openGraph: {
    title: "Tonight",
    description: "A week of meals from what's in your fridge.",
    type: "website",
  },
};

const SAMPLE_PANTRY = [
  "chicken thighs", "rice", "onion", "garlic", "olive oil", "frozen peas",
  "eggs", "soy sauce", "tortillas", "black beans", "cheddar", "sour cream",
  "lemons", "spinach", "salmon",
];

const SAMPLE_MEALS = [
  { day: "Monday", name: "Sheet-pan lemon salmon with rice and peas", uses: ["salmon", "rice", "frozen peas", "lemons"] },
  { day: "Tuesday", name: "Black bean and cheddar quesadillas with spinach on the side", uses: ["tortillas", "black beans", "cheddar", "spinach"] },
  { day: "Wednesday", name: "Chicken fried rice with garlic and eggs", uses: ["chicken thighs", "rice", "eggs", "garlic", "soy sauce"] },
  { day: "Thursday", name: "Tuesday's leftover quesadillas + a fried egg on top", uses: ["leftover"] },
  { day: "Friday", name: "Tortilla soup with black beans and sour cream", uses: ["tortillas", "black beans", "sour cream", "onion"] },
];

const SAMPLE_GROCERY = [
  "limes (1)",
  "fresh cilantro (1 bunch)",
  "avocado (2)",
  "salsa verde (1 jar)",
];

export default async function CLanding() {
  const session = await getSession();
  const free = getFreeLimit("c");
  const recent = session
    ? await prisma.mealPlan.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  const cta = session
    ? { label: "Plan this week", href: "/c/new" }
    : { label: "Try Tonight free", href: "/signup" };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-20">
      <Hero
        pill="Tonight · dinner"
        title="Stop deciding what to cook every night."
        subtitle="Tell Tonight what is in your fridge. Get a week of meals, one grouped grocery list, and a note about which leftover feeds Tuesday lunch."
        body="It uses what you already have before suggesting a grocery run. It varies the protein across the week. It remembers what you actually cooked last week so it does not suggest the same stir-fry on Tuesday."
        primary={cta}
        secondary={{ label: "See an example", href: "#example" }}
      />

      <section id="example">
        <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          What you actually get
        </h2>

        <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            You said you have
          </p>
          <p style={{ color: "var(--color-ink-700)", lineHeight: 1.55 }}>
            {SAMPLE_PANTRY.join(", ")}
          </p>
        </div>

        <div className="space-y-2" style={{ marginBottom: "1.5rem" }}>
          {SAMPLE_MEALS.map((m) => (
            <div
              key={m.day}
              className="card"
              style={{ padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "baseline" }}
            >
              <div style={{ minWidth: 90, color: "var(--color-ink-500)", fontSize: "0.9rem" }}>
                {m.day}
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>{m.name}</p>
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.15rem" }}>
                  uses: {m.uses.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "1.25rem 1.5rem", background: "var(--color-forest-50)" }}>
          <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>Grocery list</p>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--color-ink-700)", lineHeight: 1.6 }}>
            {SAMPLE_GROCERY.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </section>

      <HowItWorks
        steps={[
          { n: 1, title: "Tell us what you have", body: "Type or paste your pantry. Snap a photo of your fridge if you would rather. Tell us about any allergies, dislikes, or hard rules." },
          { n: 2, title: "Get five nights of meals", body: "Monday through Friday. One cooked meal per night. The protein changes. The leftover rotation is built in so you are not eating sad chicken on day three." },
          { n: 3, title: "Cook, mark, repeat", body: "Mark each meal as cooked or skipped. Next week, it remembers what you actually made and adjusts." },
        ]}
      />

      <ForWho
        title="Who this is for"
        items={[
          { text: "You cook 4-5 nights a week and dread the 'what do you want to eat' conversation." },
          { text: "You buy the same groceries every week and want someone to break the loop." },
          { text: "You have picky eaters and need actual variation, not 'chicken but with different sauce.'" },
          { text: "You want to waste less food and eat your leftovers on purpose." },
        ]}
      />

      <ForWho
        title="Not for"
        variant="not"
        items={[
          { text: "If you cook once a week and eat out the rest, this is overkill." },
          { text: "Strict specialty diets (keto, AIP, etc.) need a human nutritionist. We can do most things but not medical." },
        ]}
      />

      <section>
        <h2 className="serif" style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
          Pricing
        </h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Free for {free} plans a month. Then ${PRICING.c.price / 100}/mo for unlimited.
        </p>
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontWeight: 500 }}>Tonight Unlimited · ${PRICING.c.price / 100}/mo</p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Unlimited weekly plans. Pantry memory. Cooked-meal history. Photo
            upload for the fridge. Leftover rotation across weeks.
          </p>
        </div>
      </section>

      <Faq
        items={[
          { q: "Does it know what is actually in my fridge?", a: "Only what you tell it. You can type, paste, or snap a photo. The pantry is saved between weeks so you do not have to re-type it. We do not connect to your smart fridge (and do not plan to)." },
          { q: "What if I hate one of the meals?", a: "Mark it skipped. Tonight learns what you actually cook. It will lean into your favorites and stop suggesting the things you never make." },
          { q: "Can it handle picky eaters?", a: "Yes. You can add restrictions, dislikes, and 'always a side of X' preferences. We try to vary the protein and the vegetable so you are not eating the same meal twice." },
          { q: "Does it tell you to buy a ton of stuff?", a: "It tries to use what you already have first. The grocery list is grouped by aisle and only includes what you do not already own." },
        ]}
      />

      <FinalCta
        title="Plan this week."
        sub="Free for your first three plans. After that, $5/mo for unlimited. Cancel any time."
        cta={cta}
      />
    </div>
  );
}
