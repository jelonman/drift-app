export const metadata = {
  title: "Privacy — omicron",
  description: "What we collect, what we do with it, and how to ask us to delete it.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-32 space-y-8">
      <div>
        <h1 className="mb-4">Privacy</h1>
        <p className="muted">Last updated 2 June 2026</p>
      </div>

      <p>
        omicron is a small site. We collect only what we need to run the four apps
        and to send you the emails you opt into. We do not sell anything, to
        anyone, ever. There are no third-party trackers, no pixels, no analytics
        scripts in your browser.
      </p>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          What we collect
        </h2>
        <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.7 }}>
          <li>
            <strong>Account email and password hash</strong> (bcrypt) — so you
            can sign in.
          </li>
          <li>
            <strong>Conversations, drops, friends, and meal plans</strong> you
            create inside Three Dots, Tag In, Tonight, and Still Here. Stored in
            a Postgres database so you can come back to them.
          </li>
          <li>
            <strong>Subscription status</strong> from Stripe (active, canceled,
            period end). We never see or store your card details — that all lives
            in Stripe.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          What we do not collect
        </h2>
        <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.7 }}>
          <li>Your real name. The username is the part of your email before the @.</li>
          <li>Your phone number.</li>
          <li>Location data.</li>
          <li>Anything about what you do on other sites.</li>
        </ul>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          AI processing
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          When you submit something to one of the apps (a chat, a flyer note, a
          pantry list, a friend context), the text is sent to our AI provider
          (OpenRouter) to generate a reply or suggestion. The text is processed
          in real time. It is not used to train any model. The AI provider
          retains inputs for up to 30 days for abuse monitoring, then deletes
          them.
        </p>
        <p style={{ lineHeight: 1.7, marginTop: "0.75rem" }}>
          If you would rather the AI not see a specific piece of text, edit it
          down before pasting. The app is a tool, not a witness.
        </p>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Cookies
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          One cookie. It holds your session token so you stay logged in. It
          expires after 30 days of inactivity. We do not use tracking cookies,
          ad cookies, or third-party cookies.
        </p>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Data deletion
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Email us and we will delete your account and everything in it within
          seven days. There is no dark pattern, no survey, no retention period.
          We will email you back when the deletion is done.
        </p>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Where the data lives
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Postgres database on Neon (us-east-1). Session tokens in your cookie.
          Files you upload (when that lands) on Vercel Blob (us-east-1). Stripe
          holds your card and your subscription record. We use OpenRouter as the
          AI gateway.
        </p>
      </section>

      <section>
        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Contact
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Privacy questions: <a href="mailto:hello@omicron.ink">hello@omicron.ink</a>.
        </p>
      </section>
    </div>
  );
}
