# omicron

**Live:** https://omicron.ink

omicron — small tools for the friction in your life. Four apps. Each one its own subscription.

| App | Slug | What it does |
|---|---|---|
| **Three Dots** | `/a` | Paste a chat. Get 4 reply options + a note on the hesitation. |
| **Tag In** | `/b` | Drop a messy parent note. Get the tasks split fairly + a draft reply. |
| **Tonight** | `/c` | List your pantry. Get a 5-night meal plan + a grouped grocery list. |
| **Still Here** | `/d` | Add friends. Get a Sunday nudge + a personal opener. |

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** Prisma 7 + SQLite (local dev) / Neon Postgres (Vercel prod, auto-provisioned)
- **Auth:** email + password with bcryptjs, JWT cookie via jose
- **AI:** OpenRouter (`anthropic/claude-3.5-haiku` by default — fast + cheap)
- **Payments:** Stripe (test mode live, 4 products + 4 prices + webhook)
- **Email:** Resend (live; test-mode limited to account owner)
- **Image uploads:** Vercel Blob (school flyer for B, fridge photo for C, 5MB max)
- **Cron:** Vercel Cron (Sunday 13:00 UTC for Still Here digest)
- **Styling:** Tailwind 4 with a custom warm palette — no AI-slop design
- **Analytics:** Vercel Web Analytics
- **Hosting:** Vercel

## Run it

```bash
pnpm install
cp .env.example .env   # add your OPENROUTER_API_KEY
pnpm exec prisma migrate dev
pnpm dev               # http://localhost:3000
```

For production deploy, see `STATE.md` and `vercel.json`. Build swaps the SQLite schema for Postgres automatically.

## Layout

```
src/
├── app/
│   ├── page.tsx              # Landing (4-app directory)
│   ├── signup/, login/       # Auth
│   ├── a/  b/  c/  d/        # The 4 apps (one folder each)
│   ├── account/              # Account + pricing + subscribe buttons
│   ├── privacy/  terms/  help/   # Legal + help
│   ├── sitemap.ts  robots.ts # SEO
│   ├── {icon,apple-icon,opengraph-image}.tsx
│   ├── a/b/c/d/opengraph-image.tsx  # Per-app OG images (1200×630)
│   ├── error.tsx  not-found.tsx  global-error.tsx
│   └── api/                  # JSON endpoints (auth, billing, cron, apps)
├── lib/
│   ├── db.ts                 # Lazy Prisma Proxy (provider-aware)
│   ├── auth.ts               # signUp, logIn, getSession, requireUser
│   ├── ai.ts                 # OpenRouter + NO_SLOP_RULES
│   ├── stripe.ts             # PRICING (with description + freeUnit), isStripeConfigured, getSubscriptionFor
│   ├── limits.ts             # getAppUsage, canUseApp (free-tier enforcement)
│   └── email.ts              # Resend: welcome, receipt, cancel, Sunday digest
├── components/
│   └── marketing/            # Hero, HowItWorks, ForWho, SampleOutput, Faq, FinalCta
└── generated/prisma/         # Prisma 7 client output
```

## Design rules (do not break)

1. **No AI-slop copy.** Banned words list enforced in `src/lib/ai.ts`. No em-dashes, no "delve", no "leverage", no "transformative", no "AI-powered" badges.
2. **No gradient/glow/glassy UI.** Plain rounded corners, cream background, forest accent, serif headings. See `src/app/globals.css`.
3. **No streaks, badges, or engagement loops.** These are tools, not games.
4. **Each app has its own data, its own pricing, its own URL.** A user can subscribe to one and ignore the others.
5. **Free tier exists for all 4 apps.** A user can try before paying.

## What it costs to run

Per active user per month, at moderate use (5 AI calls per week per app):
- AI: ~$0.05–0.15/user
- DB: free (Neon free tier)
- Hosting: free (Vercel hobby tier until ~1000 users)
- Email: ~$0.001/user (Resend free tier covers 100/day)

## What it costs to ship

- Domain: $12–20/year (optional but recommended)
- Vercel hobby: $0
- Neon: $0 (free tier)
- OpenRouter: pay-as-you-go, ~$5 covers first 100 active users
- Resend: $0 (free tier, 100 emails/day)
- Stripe: 2.9% + 30¢ per transaction

## Hard-stops for human to act on (before public launch)

These are documented in detail in `STATE.md`. Short version:

1. **Stripe** — swap test mode for live mode once you're ready to charge real cards.
2. **Resend domain verification** — add the SPF + DKIM DNS records for `omicron.ink` to send from `hello@omicron.ink` (DNS records already propagate since the domain's on Vercel nameservers; verification happens once Vercel DNS is active).
3. **A user** — share on Indie Hackers / Reddit / X. Drafts in `launch-content/LAUNCH-POSTS.md`.
