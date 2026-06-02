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
  title: "Three Dots — Reply options for the texts you keep staring at",
  description:
    "Paste a chat. Get four reply options that match how you actually want to sound. Plus one line on what the hesitation is really about.",
  openGraph: {
    title: "Three Dots",
    description: "Reply options for the texts you keep staring at.",
    type: "website",
  },
};

const SAMPLE_REPLIES = [
  {
    tone: "warm",
    text: "Hey, I would love to. Sunday afternoon might work. Want me to come to you or should we meet somewhere?",
    why: "Leaves the logistics open and signals genuine interest without putting the work on them.",
  },
  {
    tone: "playful",
    text: "Coffee mission: accepted. Saturday or Sunday work better for you?",
    why: "Lightens the moment. Shows you are saying yes without overthinking it.",
  },
  {
    tone: "direct",
    text: "Yes, I am in. Saturday at 2 works for me. Where should I meet you?",
    why: "Removes the loop. Saying yes out loud is the whole point.",
  },
  {
    tone: "leave_space",
    text: "Sounds good. Let me check my weekend and get back to you.",
    why: "Buys you 24 hours. No need to commit to the time right now.",
  },
];

const SAMPLE_COACHING =
  "You are not stuck on what to say. You are stuck on whether saying yes is making a bigger promise than you mean to. It is not. It is just coffee.";

export default async function ALanding() {
  const session = await getSession();
  const free = getFreeLimit("a");
  const recent = session
    ? await prisma.conversation.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  const cta = session
    ? { label: "Start a conversation", href: "/a/new" }
    : { label: "Try Three Dots free", href: "/signup" };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-20">
      <Hero
        pill="Three Dots · texting"
        title="Stop staring at the keyboard."
        subtitle="Paste a chat you are stuck on. Get four replies that match how you actually want to sound."
        body="It reads the whole conversation, notices the loop you are in, and gives you reply options with the reason each one works. Plus one line on what the hesitation is really about."
        primary={cta}
        secondary={{ label: "See an example", href: "#example" }}
      />

      <SampleOutput
        sampleChat={[
          { from: "them", text: "Hey, want to grab coffee this weekend?" },
          { from: "you", text: "(staring at the keyboard for 20 min)" },
        ]}
        replies={SAMPLE_REPLIES}
        coaching={SAMPLE_COACHING}
      />

      <HowItWorks
        steps={[
          { n: 1, title: "Paste the conversation", body: "Copy the chat you are stuck on. Tell us where things stand and how you are feeling. That is all the setup." },
          { n: 2, title: "Get four reply options", body: "Warm, playful, direct, and leave-space. Each with a one-sentence reason it works for you, not for them." },
          { n: 3, title: "Send the one that fits", body: "Copy, edit if you want, send. No more drafts. No more re-reading it 12 times." },
        ]}
      />

      <ForWho
        title="Who this is for"
        items={[
          { text: "You have been typing and deleting the same text for 20 minutes." },
          { text: "You write something, read it back, and overthink the punctuation." },
          { text: "You keep getting stuck on the opening line of a new match." },
          { text: "You are bad at small talk and tired of pretending you are good at it." },
        ]}
      />

      <ForWho
        title="Not for"
        variant="not"
        items={[
          { text: "Negotiating salary, leases, or anything that matters legally. Get a human for that." },
          { text: "Replies to abusive or manipulative messages. Please reach out to a real person." },
        ]}
      />

      {session && recent.length > 0 && (
        <section>
          <h2 className="serif" style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
            Your recent conversations
          </h2>
          <div className="space-y-2">
            {recent.map((c) => (
              <Link
                key={c.id}
                href={`/a/c/${c.id}`}
                className="card block"
                style={{ textDecoration: "none", padding: "1rem 1.25rem" }}
              >
                <div className="flex items-baseline justify-between">
                  <span style={{ fontWeight: 500 }}>{c.stage} · {c.mood}</span>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                  {c.pastedText.slice(0, 120)}{c.pastedText.length > 120 ? "..." : ""}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="serif" style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
          Pricing
        </h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Free for {free} conversations a month. Then ${PRICING.a.price / 100}/mo for unlimited.
          Cancel any time.
        </p>
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontWeight: 500 }}>Three Dots Pro · ${PRICING.a.price / 100}/mo</p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Unlimited conversations. Save and revisit any of them. See your own
            patterns over time.
          </p>
        </div>
      </section>

      <Faq
        items={[
          { q: "Is this just ChatGPT with extra steps?", a: "It uses a large language model, yes. The difference is the prompt is built specifically for drafting replies to a chat you are stuck on — including noticing the loop, naming the hesitation, and giving you options instead of one answer." },
          { q: "Do you store my conversations?", a: "Yes, encrypted, so you can come back to them. You can delete any conversation at any time. We never share your chats with anyone, and we never use them to train models." },
          { q: "Will it sound like AI?", a: "We work hard to keep it from sounding like AI. No em-dashes, no jargon, no over-the-top affirmations. It tries to sound like the person you are, not like a chatbot." },
          { q: "Can I cancel any time?", a: "Yes, one click in your account page. You keep access until the end of the period you already paid for." },
        ]}
      />

      <FinalCta
        title="Stuck on a text right now?"
        sub="Sign up, paste it, get four replies. Free for your first five conversations."
        cta={cta}
      />
    </div>
  );
}
