import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PRICING, getFreeLimit } from "@/lib/stripe";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ForWho } from "@/components/marketing/for-who";
import { SampleOutput } from "@/components/marketing/sample-output";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = {
  title: "Still Here — Stay close to the people you keep meaning to text",
  description:
    "Add the friends you keep meaning to text. Still Here keeps a quiet eye on who you have not talked to in a while, drafts a personal opener, and reminds you a month later to see how it went.",
  openGraph: {
    title: "Still Here",
    description: "Stay close to the people you keep meaning to text.",
    type: "website",
  },
};

const SAMPLE_FRIEND = {
  name: "Maya Chen",
  context: "College roommate. New baby, hates small talk, loves indie folk. Last real conversation was 4 months ago, around when the baby came.",
};

const SAMPLE_OPENERS = [
  {
    tone: "warm",
    text: "Hey Maya, I have been thinking about you and wondering how life is treating you since the baby arrived. No pressure to respond, just sending some warmth your way.",
    why: "Low-stakes. Acknowledges the major life change without demanding anything back.",
  },
  {
    tone: "callback",
    text: "Random thought: I heard a new Bon Iver track the other day and immediately thought of our late-night listening sessions back in the dorm. Made me miss our talks.",
    why: "References a real shared thing. Gives her something easy to respond to or not.",
  },
  {
    tone: "forward",
    text: "I am curious how you are navigating parenthood. Have you discovered any unexpected joys or hilarious moments with the little one?",
    why: "Shows genuine interest in her current life stage and invites her to share on her own terms.",
  },
];

export default async function DLanding() {
  const session = await getSession();
  const free = getFreeLimit("d");
  const friends = session
    ? await prisma.friend.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  const cta = session
    ? { label: "Add a friend", href: "/d/friends/new" }
    : { label: "Try Still Here free", href: "/signup" };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-20">
      <Hero
        pill="Still Here · friendships"
        title="Stay close to the people who used to be close."
        subtitle="Add the friends you keep meaning to text. Still Here keeps a quiet eye on who you have not talked to in a while and drafts a personal opener."
        body="It reads the notes you have on each friend — what you have been up to, what they have been up to, what you talked about last time — and writes a message that sounds like the relationship, not a LinkedIn check-in."
        primary={cta}
        secondary={{ label: "See an example", href: "#example" }}
      />

      <section id="example">
        <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          What you actually get
        </h2>

        <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            You added
          </p>
          <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>{SAMPLE_FRIEND.name}</p>
          <p style={{ color: "var(--color-ink-700)", lineHeight: 1.55, fontSize: "0.95rem" }}>
            {SAMPLE_FRIEND.context}
          </p>
        </div>

        <SampleOutput replies={SAMPLE_OPENERS} sampleChat={[]} />

        <p className="muted" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          The opener reads what you wrote on Maya. Replace any phrase you want before sending.
        </p>
      </section>

      <HowItWorks
        steps={[
          { n: 1, title: "Add the people you keep meaning to text", body: "Name, how you know them, what is going on in their life right now, anything you have been meaning to ask. The more you write, the better the openers get." },
          { n: 2, title: "Still Here watches quietly", body: "When it has been a while since you talked, you get a single nudge. One opener draft. Three tones to choose from." },
          { n: 3, title: "You send it, or you do not", body: "No streaks. No 'you have not texted in 87 days.' Mark it sent when you do, and Still Here backs off for a while." },
        ]}
      />

      <ForWho
        title="Who this is for"
        items={[
          { text: "You have a list of 5-10 people you keep meaning to text but never do." },
          { text: "You moved away from a city and the friendships you had there are drifting." },
          { text: "You had a kid or a busy season and lost touch with people you did not want to lose touch with." },
          { text: "You want a low-key way to keep up, not a CRM for your friendships." },
        ]}
      />

      <ForWho
        title="Not for"
        variant="not"
        items={[
          { text: "If your circle is small and tight, just text them. This is for the people you are about to lose." },
          { text: "If you are looking for a dating app or a way to meet new people, this is not it." },
        ]}
      />

      <section>
        <h2 className="serif" style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
          Pricing
        </h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Free for {free} friends. Then ${PRICING.d.price / 100}/mo for unlimited.
        </p>
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontWeight: 500 }}>Still Here Plus · ${PRICING.d.price / 100}/mo</p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Unlimited friends. Weekly nudges. Daily on-demand openers.
            Personal context memory per friend. Cancel any time.
          </p>
        </div>
      </section>

      <Faq
        items={[
          { q: "Is this creepy?", a: "It is a draft. You read it, edit it, and you send it. Nothing gets sent automatically. The context you write about your friends stays in your account and is never shared or used to train models." },
          { q: "What does the nudge look like?", a: "One email a week, listing the friends you have not talked to recently. Click into any one of them to see the openers. You can mute individual friends or the whole thing." },
          { q: "Will it text people for me automatically?", a: "No. We do not believe in that. It drafts. You send. The whole point is to keep the relationship human." },
          { q: "What if I have not talked to someone in 5 years?", a: "Still Here will not push you. It will just quietly include them in your list so you can write a personal opener when you are ready. Some friendships need a long runway." },
        ]}
      />

      <FinalCta
        title="Add the people you keep meaning to text."
        sub="Free for your first three friends. $5/mo after that. Cancel any time."
        cta={cta}
      />
    </div>
  );
}
