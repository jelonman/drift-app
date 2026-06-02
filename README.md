# Four

**Live:** https://drift-app-gamma.vercel.app

Four small AI tools, one quiet site.

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
- **Payments:** Stripe (test mode wired, needs real keys to enable)
- **Email:** Resend (wired, needs API key to enable)
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

1. **Stripe** — create account → 4 monthly products → add 6 env vars to Vercel
2. **Vercel Blob** — provision → add `BLOB_READ_WRITE_TOKEN` env (for flyer/fridge photo upload in B and C)
3. **Resend** — create account → API key → add `RESEND_API_KEY` env
4. **Cron secret** — `openssl rand -base64 32` → add `CRON_SECRET` env
5. **Domain** — recommended `jelonman.dev` ($12/yr) for personal umbrella
6. **GitHub repo privacy** — install Vercel GitHub App on jelonman account
