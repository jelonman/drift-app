import Link from "next/link";

export const metadata = {
  title: "Help — Four",
  description: "How to use the four apps, what they cost, and how to cancel.",
};

const APPS = [
  {
    slug: "a",
    name: "Three Dots",
    href: "/a",
    intro: "Reply drafting for hard texts.",
    items: [
      { q: "How do I paste a conversation?", a: "Copy the messages from iMessage, WhatsApp, whatever. Paste it into the box. The app reads the whole thing, not just the last line." },
      { q: "What does the vibe field do?", a: "Tells the AI how you want to come across. Calm, playful, direct, exhausted. Pick the one that matches the energy you wish you had." },
      { q: "Why four replies, not three?", a: "Three felt too few. You usually throw one out as not-you. With four, you have a backup. The tones are warm, playful, direct, and a short one that leaves space." },
      { q: "Where do the replies go?", a: "Into a private page only you can see. Click into any of them, edit, copy, and send from your own messaging app. We do not send anything for you." },
      { q: "What is the free tier?", a: "Five conversations a month. No card required. After that, $5/mo for unlimited." },
    ],
  },
  {
    slug: "b",
    name: "Tag In",
    href: "/b",
    intro: "Split household tasks from voice memos and texts.",
    items: [
      { q: "How do I drop a note?", a: "Type, paste, or snap a photo. The app reads the text and pulls out the action items." },
      { q: "How does it split tasks?", a: "Based on what you have each done recently (so it is not first-claim) and what makes sense for the task itself. The other parent gets a heads-up in the app, not a text from the AI." },
      { q: "What if I only have one parent?", a: "That is fine. The app just lists the tasks for you, no splitting." },
      { q: "Does it draft the text back to the school?", a: "Yes, when the note is a reply to someone. You can edit it before it goes anywhere. The text only goes to the school if you copy and paste it yourself." },
      { q: "What is the free tier?", a: "Fourteen days of planning from your first drop. Then $9/mo for unlimited." },
    ],
  },
  {
    slug: "c",
    name: "Tonight",
    href: "/c",
    intro: "A week of meals from what is in your fridge.",
    items: [
      { q: "How does it know what is in my fridge?", a: "It does not. You type your pantry, paste a list, or snap a photo. The pantry is saved between weeks so you only add new things." },
      { q: "What if I hate one of the meals?", a: "Mark it skipped. Tonight leans into what you actually cooked." },
      { q: "Can it handle picky eaters?", a: "Yes. You can add restrictions, dislikes, and always-a-side-of-X preferences." },
      { q: "What is the free tier?", a: "Three plans a month. After that, $5/mo for unlimited." },
    ],
  },
  {
    slug: "d",
    name: "Still Here",
    href: "/d",
    intro: "Drafts personal openers to friends you keep meaning to text.",
    items: [
      { q: "How do I add a friend?", a: "Name, how you know them, what is going on in their life right now. The more you write, the better the openers get." },
      { q: "Will it text them for me automatically?", a: "No. It drafts. You send. The whole point is to keep the relationship human." },
      { q: "What does the nudge look like?", a: "One email a week (Sundays) listing the friends you have not talked to in a while. Click into any of them to see the openers. You can mute it from your account." },
      { q: "What is the free tier?", a: "Three friends on the list. After that, $5/mo for unlimited." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-32 space-y-16">
      <div>
        <h1 className="mb-4">Help</h1>
        <p className="muted">
          How each of the four apps works, what they cost, and what to do when
          something feels off.
        </p>
      </div>

      {APPS.map((app) => (
        <section key={app.slug} id={app.slug}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="serif" style={{ fontSize: "1.75rem" }}>
              {app.name}
            </h2>
            <Link href={app.href} className="btn-ghost">Open {app.name}</Link>
          </div>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>{app.intro}</p>
          <div className="space-y-5">
            {app.items.map((item, i) => (
              <div key={i} className="card" style={{ padding: "1rem 1.25rem" }}>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem", fontWeight: 500 }}>
                  {item.q}
                </h3>
                <p className="muted" style={{ lineHeight: 1.55, fontSize: "0.95rem" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Account and billing
        </h2>
        <div className="space-y-5">
          <div className="card" style={{ padding: "1rem 1.25rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem", fontWeight: 500 }}>
              How do I cancel a subscription?
            </h3>
            <p className="muted" style={{ lineHeight: 1.55, fontSize: "0.95rem" }}>
              From your <Link href="/account">account page</Link>, click Manage next to the app. That opens Stripe where you cancel with one click. You keep access until the end of the billing period. There is no retention survey.
            </p>
          </div>
          <div className="card" style={{ padding: "1rem 1.25rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem", fontWeight: 500 }}>
              Can I get a refund?
            </h3>
            <p className="muted" style={{ lineHeight: 1.55, fontSize: "0.95rem" }}>
              We do not offer refunds for partial months. If you were charged in error or the app was broken when you tried to use it, email <a href="mailto:hello@four.tools">hello@four.tools</a> and we will figure it out.
            </p>
          </div>
          <div className="card" style={{ padding: "1rem 1.25rem" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem", fontWeight: 500 }}>
              How do I delete my account?
            </h3>
            <p className="muted" style={{ lineHeight: 1.55, fontSize: "0.95rem" }}>
              Email <a href="mailto:hello@four.tools">hello@four.tools</a> with the email you signed up with. We delete everything within seven days and email you back when it is done. There is no in-app button because we want you to be sure.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Still stuck?
        </h2>
        <p>
          Email <a href="mailto:hello@four.tools">hello@four.tools</a>. A real
          person (or one good AI) will reply within a day or two.
        </p>
      </section>
    </div>
  );
}
