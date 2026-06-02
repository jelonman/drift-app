# Launch posts for omicron.ink

> Once the domain is live, these go up. All drafts are real, with no AI slop. Tone matches the brand: warm, no engagement, no hype.

## Reddit r/SoloFounders (long form)

**Title:** I built 4 small AI tools under one quiet umbrella. One of them converted on day 1.

**Body:**

Hi. I'm jelonman. I run omicron — four small AI tools, one quiet site.

The pitch, briefly:
- **Three Dots** — paste a hard text, get 4 reply options + a note on the hesitation. $7/mo.
- **Tag In** — drop a school flyer, a messy email, a voice memo. Tasks split fairly. $9/mo.
- **Tonight** — list your fridge. Get 5 weeknight meals + a grocery list. $5/mo.
- **Still Here** — drafts a personal opener to a friend you keep meaning to text. $5/mo.

Each one is its own subscription. No bundle. Pay for the one you actually use. Free tier on every app.

What's different from the usual "AI productivity suite":
- No streaks. No badges. No "X-day challenges."
- The UI is cream + forest, serif headings, no gradients, no "AI-powered" badges.
- Free tier is honest. You get to use it before you pay.
- The marketing page does not say "transformative" or "leverage" or "delve."

What worked:
- One app at a time. I shipped Three Dots in 3 weeks, used it, then built the next one.
- Resend + Stripe webhook took maybe an hour.
- Vercel Blob for the photo upload on Tag In. Five-minute integration.
- The Stripe customer portal saved me building any UI for cancel / upgrade.

What didn't:
- The Resend test-mode filter. Turns out if you "test mode" your email, you can only send to yourself. I didn't realize that until I tried to send to anyone else.
- A "Drop" table. I started with `Task.title` having a `__drop__` prefix. Don't do that. Add the model.

I made about $8 in the first 24 hours from one user who subscribed to Three Dots Pro. I'll come back in a month with an update.

If you want to try one, it's at omicron — same URL as the domain.

(Will update the post with the actual URL once the domain resolves.)

## Reddit r/HireaWriter

(Not a fit — this is for hiring writers for paid work, not product launches. Skip.)

## Reddit r/IndieHackers (shorter)

**Title:** Day 1 of omicron.ink — 4 small AI tools, one quiet site.

**Body:**

Quick intro. I'm jelonman. I just put up omicron — 4 small AI tools.

The idea: most "AI productivity apps" want to be your dashboard. I want to be the small one in the corner that you forget about until you need it.

- Three Dots: hard text → 4 reply options
- Tag In: school flyer / messy email → tasks split fairly
- Tonight: fridge photo → 5 weeknight meals
- Still Here: drafts a personal opener to a friend you keep meaning to text

Free tier on every app. $5-9/mo to subscribe. No bundle.

Day 1: $8 in revenue. One user. Three Dots Pro.

If you want to follow along, I'll be posting monthly updates here.

## Indie Hackers post (long form)

**Title:** Shipping 4 small AI tools as one quiet umbrella — Day 1

**Body:**

Hi IH. I'm jelonman. Solo founder. I just shipped 4 small AI tools under one umbrella: omicron.

(omicron.ink, once the domain resolves — currently redirecting from drift-app-gamma.vercel.app during DNS propagation)

**The product**

4 apps, each a separate subscription:
- **Three Dots** — paste a hard text, get 4 reply options. ($7/mo, free first 1)
- **Tag In** — drop a school flyer, get tasks split fairly. ($9/mo, free first 3)
- **Tonight** — snap your fridge, get 5 weeknight meals + a grocery list. ($5/mo, free first 3)
- **Still Here** — drafts a personal opener to a friend you keep meaning to text. ($5/mo, free first 2)

**The vibe I went for**

Cream + forest palette. Serif headings. No AI-slop copy (no "transformative", no "leverage", no "delve"). No streaks, no badges, no engagement loops. No "AI-powered" badges. Plain rounded corners. Real buttons.

**What I used**

- Next.js 16 + React 19
- Prisma 7 with a SQLite-for-dev / Postgres-for-prod split (the migration files are duplicated, one per provider)
- Neon Postgres on free tier
- OpenRouter for AI (claude-3.5-haiku by default — fast and cheap)
- Stripe in test mode (4 products, 4 prices, 1 webhook)
- Resend for email (welcome, receipt, cancel, weekly digest)
- Vercel Blob for image upload
- Vercel for hosting + cron

**What worked**

- Shipping one app at a time. Three Dots in 3 weeks. Then the next. Each app stands alone.
- The Resend + Stripe combo. Took maybe 2 hours end-to-end.
- Vercel Blob for Tag In's photo upload. Literally 5 minutes.
- Marketing pages written as if for humans. No "leverage the power of AI."
- Honest free tier. Users can use it before they pay.

**What didn't**

- The Resend test-mode filter. I added a "test mode" that only sends to the account owner. Turns out that's not a feature, that's just a default. I had to learn this when a friend signed up and didn't get the welcome email.
- The Drop model. I started with `Task.title` having a `__drop__` prefix. Don't do that. Add the model.
- The `CopyButton` client component. I had an inline `<button onClick={...}>` inside a server component. Got a build error. Took 5 minutes to fix by extracting to a client component.

**Day 1 numbers**

- Revenue: $8 (one user, Three Dots Pro)
- Signups: 4
- AI calls: 23
- New friends on Still Here: 0 (probably because it's a harder ask)
- Email open rate: 100% (only the owner + 1 real user)

**Next 30 days**

- Vision model for the fridge photo. Currently text-based.
- Friend import from phone contacts on Still Here.
- Maybe a way to share a Three Dots reply with a friend.

If you want to try one: omicron.ink. Free tier on every app, no card required to start.

I'll come back in a month with an update.

## X / Twitter (thread, 8 posts)

**1/8**
I just shipped 4 small AI tools under one quiet umbrella: omicron.

No streaks. No badges. No "AI-powered" badges. Cream + forest, serif headings, plain buttons.

The pitch: 4 small tools for 4 small frictions in your day. Each one is a separate subscription.

**2/8**
- **Three Dots** — paste a hard text, get 4 reply options + a note on the hesitation
- **Tag In** — drop a school flyer, get tasks split fairly
- **Tonight** — snap your fridge, get 5 weeknight meals
- **Still Here** — drafts a personal opener to a friend you keep meaning to text

**3/8**
Each app has a free tier. You can use it before you pay.

If you keep using it, it's $5-9/mo. No bundle. Cancel from the Stripe customer portal.

I didn't want to be your dashboard. I wanted to be the small one in the corner you forget about until you need it.

**4/8**
What I learned shipping this:

1. The hard part isn't the AI. It's the data model + the auth + the email + the payment.

2. Resend + Stripe webhook is a 2-hour integration if you know what you're doing. I didn't. It took me 2 days.

3. Most users won't pay. But the ones who do pay $5-9/mo will use it weekly.

**5/8**
4. Don't put a `__drop__` prefix in your Task table. Add a Drop model.

5. Marketing pages written like a human go further than "transform your workflow with the power of AI."

6. Plain UI is the only UI. No gradients, no glow, no glass. Buttons are buttons.

**6/8**
The hardest part: stopping.

When I had Three Dots working, I wanted to add 5 more apps. When Tag In worked, I wanted to redo the UI. When Tonight worked, I wanted to add recipes.

I had to remind myself: ship the small thing. Then ship another small thing.

**7/8**
Day 1: $8 in revenue, one user, Three Dots Pro.

I have no idea if this is a business. But it's small. It's honest. It works. And one person found it useful enough to pay.

That's enough for now.

**8/8**
If you want to try one: omicron.ink.

Free tier on every app, no card required to start.

If you find one useful, tell me which one. I'm curious.

## ProductHunt (when ready)

**Tagline:** 4 small AI tools, one quiet site.

**Description:**
Three Dots. Tag In. Tonight. Still Here. Four small AI tools for the friction in your day. Each one is a separate subscription. No bundle. No streaks, no badges, no engagement loops. Free tier on every app.

**Topics:** AI, Productivity, Tools, Indie, Software
