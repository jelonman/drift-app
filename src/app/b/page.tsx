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
  title: "Tag In — Stop being the one who remembers everything",
  description:
    "Drop a school flyer, a text from the teacher, a voice memo. Tag In pulls out the tasks, splits them between you and your partner, and drafts the reply.",
  openGraph: {
    title: "Tag In",
    description: "Stop being the one who remembers everything.",
    type: "website",
  },
};

const SAMPLE_NOTE =
  "Saw the school flyer for the spring concert. May 18, 6pm. Maya needs a white shirt and black pants. Also dentist appointment for Leo on May 22 at 3pm. Don't forget to pick up groceries on the way home.";

const SAMPLE_TASKS = [
  { tone: "direct", text: "Order a white button-down and black pants for Maya in size 8.", why: "You: time-sensitive + Maya-specific. You know her closet." },
  { tone: "forward", text: "Put May 18 spring concert at 6pm on the calendar.", why: "Either of you — but it lives on the shared calendar either way." },
  { tone: "warm", text: "Take Leo to the dentist, May 22 at 3pm.", why: "Partner: dentist visits need an adult who can leave work. They have the 3pm slot open." },
  { tone: "callback", text: "Pick up groceries on the way home.", why: "You: you are already driving by the store. Saves a trip." },
  { tone: "leave_space", text: "Reply to the school email confirming the concert.", why: "Partner: low-effort, just needs to hit send." },
];

const SAMPLE_COACHING =
  "You are doing four of the five things already. The other parent is not seeing how much you are carrying. Make this visible.";

export default async function BLanding() {
  const session = await getSession();
  const free = getFreeLimit("b");
  const family = session
    ? await prisma.family.findFirst({
        where: { ownerId: session.userId },
        orderBy: { createdAt: "desc" },
        include: { tasks: { where: { status: { not: "done" } }, take: 5, orderBy: { createdAt: "desc" } } },
      })
    : null;

  const cta = session && family
    ? { label: "Drop a new note", href: "/b/new" }
    : session
    ? { label: "Set up your family", href: "/b/family/new" }
    : { label: "Try Tag In free", href: "/signup" };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-20">
      <Hero
        pill="Tag In · parenting"
        title="You should not be the one who remembers everything."
        subtitle="Drop a school flyer, a text from the teacher, a voice memo. Tag In pulls out the tasks and splits them between you and your partner."
        body="It reads the note, notices who is overloaded lately, and assigns each task to the parent who is more likely to actually do it. It also drafts the reply to whoever sent the original message, so you are not the one typing it at 11pm."
        primary={cta}
        secondary={{ label: "See an example", href: "#example" }}
      />

      <section id="example">
        <h2 className="serif" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          What you actually get
        </h2>

        <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            The note you dropped
          </p>
          <p style={{ lineHeight: 1.55, color: "var(--color-ink-700)" }}>{SAMPLE_NOTE}</p>
        </div>

        <div className="space-y-2">
          {SAMPLE_TASKS.map((t, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "1rem 1.25rem",
                background: i % 2 === 0 ? "var(--color-forest-50)" : "var(--color-cream-100)",
              }}
            >
              <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 500, fontSize: "0.95rem" }}>{t.text}</span>
                <span
                  className="pill"
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", flexShrink: 0 }}
                >
                  {i % 2 === 0 ? "You" : "Partner"}
                </span>
              </div>
              <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.5, fontStyle: "italic" }}>
                {t.why}
              </p>
            </div>
          ))}
        </div>

        <div
          className="card-soft"
          style={{
            marginTop: "1rem",
            padding: "1rem 1.25rem",
            background: "var(--color-cream-100)",
            fontStyle: "italic",
            color: "var(--color-ink-700)",
            lineHeight: 1.5,
          }}
        >
          <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem", fontStyle: "normal" }}>
            Coaching note
          </p>
          {SAMPLE_COACHING}
        </div>
      </section>

      <HowItWorks
        steps={[
          { n: 1, title: "Drop a note", body: "Paste a text, snap a flyer, drop a voice memo, or just type the chaos. No formatting required." },
          { n: 2, title: "It extracts the tasks", body: "Reads the whole thing, picks out the actions, who they involve, and when they are due. Asks back if something is genuinely unclear." },
          { n: 3, title: "Splits them by recent load", body: "Looks at who has done the last 20 things. Sends the next one to whoever has had less on their plate. Drafts the reply text if there is one to send." },
          { n: 4, title: "Both of you see the board", body: "Once you pair with your partner, the family board shows everything in one place. Done items disappear." },
        ]}
      />

      <ForWho
        title="Who this is for"
        items={[
          { text: "You are the one who tracks the pediatrician, the school calendar, the camp form, the playdate." },
          { text: "Your partner is willing to help but does not always see what needs doing in time." },
          { text: "You have ever said out loud, 'I should not have to ask.'" },
          { text: "You are tired of being the only one who knows about the dentist." },
        ]}
      />

      <ForWho
        title="Not for"
        variant="not"
        items={[
          { text: "Single parents without a co-parent. The split is between you and someone else." },
          { text: "Co-parents who are in conflict. This is for cooperation, not custody." },
        ]}
      />

      <section>
        <h2 className="serif" style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
          Pricing
        </h2>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          {free}-day free trial. No card needed. Then ${PRICING.b.price / 100}/mo per family.
        </p>
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ fontWeight: 500 }}>Tag In Family · ${PRICING.b.price / 100}/mo</p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Unlimited drops. Both parents on the board. 30-day task history.
            Photo upload, voice memo upload, draft replies.
          </p>
        </div>
      </section>

      <Faq
        items={[
          { q: "What happens to the notes I drop?", a: "They are encrypted at rest and only visible to you and your partner. You can delete them at any time. We never share, sell, or use them to train models." },
          { q: "How does it decide who does what?", a: "It looks at the last 20 tasks assigned. If your partner has done 4 of the last 5 dentist runs, the next dentist reminder goes to you. It also factors in who the task actually involves (you probably should not be the one ordering your kid's school uniform from scratch)." },
          { q: "My partner does not want to sign up. Can I use it alone?", a: "Yes. If there is no paired partner, all tasks land on you and the app still extracts them, sets due dates, and lets you check things off. You can invite a partner later." },
          { q: "Will it draft weird text messages to my kid's teacher?", a: "It drafts what you tell it to draft. It will not invent medical or scheduling commitments. If a draft sounds off, do not send it." },
        ]}
      />

      <FinalCta
        title="Try the 14-day free trial."
        sub="Set up a family, drop a note, see the tasks split. No card required to start."
        cta={cta}
      />
    </div>
  );
}
