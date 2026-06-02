import { Resend } from "resend";

const FROM_DEFAULT = "Four <hello@four.tools>";
const FROM_DEV = "Four <onboarding@resend.dev>";

let _client: Resend | null = null;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_client) _client = new Resend(key);
  return _client;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || FROM_DEV;
}

async function send(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const c = client();
  if (!c) {
    console.log(`[email] would send to ${to}: ${subject}`);
    return { ok: false, error: "RESEND_API_KEY not set" };
  }
  // Resend in test mode only allows sending to the account owner's email.
  // Skip silently if the recipient is someone else; we'll get full delivery once a domain is verified.
  const ownerEmail = "piosarna@outlook.com";
  if (to !== ownerEmail && fromAddress() === FROM_DEV) {
    console.log(`[email] skip (test mode, not owner): ${to} — ${subject}`);
    return { ok: false, error: "skipped: test mode" };
  }
  try {
    const res = await c.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
      text,
    });
    if (res.error) {
      console.error(`[email] Resend error:`, res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    console.error(`[email] send failed:`, err);
    return { ok: false, error: String(err) };
  }
}

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="font-family:Georgia,serif;background:#fdfbf7;padding:32px;color:#3d2e1f">
  <div style="max-width:540px;margin:0 auto">
    <h1 style="font-size:28px;font-weight:500;margin:0 0 24px">${title}</h1>
    <div style="line-height:1.55;font-size:16px">${body}</div>
    <p style="margin-top:48px;color:#8a7d6a;font-size:13px">Four — small tools for the friction in your life.<br/><a href="https://drift-app-gamma.vercel.app" style="color:#8a7d6a">drift-app-gamma.vercel.app</a></p>
  </div>
</body></html>`;
}

export async function sendWelcomeEmail(email: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  return send(
    email,
    "Welcome to Four",
    layout(
      "Welcome to Four",
      `<p>Thanks for signing up. You have an account on Four, the site with four small tools for the things you keep meaning to do.</p>
      <p>Here is what you get right now, for free:</p>
      <ul>
        <li><strong>Three Dots</strong> — three replies for hard texts (5 a month)</li>
        <li><strong>Tag In</strong> — split household tasks from a voice memo (14 days)</li>
        <li><strong>Tonight</strong> — a week of meals from your fridge (3 plans a month)</li>
        <li><strong>Still Here</strong> — drafts openers to friends you keep meaning to text (3 friends)</li>
      </ul>
      <p>No streaks, no badges, no daily nudges. Just a tool when you need it.</p>
      <p><a href="https://drift-app-gamma.vercel.app/a">Try Three Dots →</a></p>`
    ),
    `Welcome to Four. You get free use of all four apps. Try Three Dots: https://drift-app-gamma.vercel.app/a`
  );
}

export async function sendPaymentReceiptEmail(
  email: string,
  appName: string,
  amount: number
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const dollars = (amount / 100).toFixed(2);
  return send(
    email,
    `Receipt: ${appName} Unlimited — $${dollars}/mo`,
    layout(
      "Thank you",
      `<p>Your subscription to <strong>${appName} Unlimited</strong> is active. You will be charged $${dollars} a month until you cancel.</p>
      <p>Manage your subscription (or cancel any time) from your <a href="https://drift-app-gamma.vercel.app/account">account page</a>.</p>
      <p>Receipts and invoices live in <a href="https://billing.stripe.com">your Stripe customer portal</a>.</p>`
    ),
    `${appName} Unlimited is active. $${dollars}/mo. Manage: https://drift-app-gamma.vercel.app/account`
  );
}

export async function sendSubscriptionCanceledEmail(
  email: string,
  appName: string,
  periodEnd: Date
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const endStr = periodEnd.toISOString().slice(0, 10);
  return send(
    email,
    `${appName} subscription canceled`,
    layout(
      "Subscription canceled",
      `<p>Your <strong>${appName} Unlimited</strong> subscription has been canceled. You still have access until <strong>${endStr}</strong>.</p>
      <p>You can re-subscribe any time from your <a href="https://drift-app-gamma.vercel.app/account">account page</a>. Your data stays put.</p>`
    ),
    `${appName} canceled. Access through ${endStr}. Re-subscribe: https://drift-app-gamma.vercel.app/account`
  );
}

export async function sendStillHereSundayDigest(
  email: string,
  friends: { name: string; daysSinceContact: number }[]
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const list = friends
    .map(
      (f) =>
        `<li><strong>${f.name}</strong> — last talked ${f.daysSinceContact} days ago</li>`
    )
    .join("");
  return send(
    email,
    "Friends you have not talked to in a while",
    layout(
      "Sunday nudge",
      `<p>It is Sunday. Here are the friends on Still Here you have not talked to in a while. Click into any of them to see a personal opener draft.</p>
      <ul>${list}</ul>
      <p><a href="https://drift-app-gamma.vercel.app/d/friends">See your list →</a></p>
      <p style="font-size:13px;color:#8a7d6a">You can mute this digest from the Still Here page.</p>`
    ),
    `Sunday nudge: friends you have not talked to in a while. https://drift-app-gamma.vercel.app/d/friends`
  );
}
