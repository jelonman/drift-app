# Four

Four small AI tools, one quiet site.

| App | Slug | What it does |
|---|---|---|
| **Three Dots** | `/a` | Paste a chat. Get 4 reply options + a note on the hesitation. |
| **Tag In** | `/b` | Drop a messy parent note. Get the tasks split fairly + a draft reply. |
| **Tonight** | `/c` | List your pantry. Get a 5-night meal plan + a grouped grocery list. |
| **Still Here** | `/d` | Add friends. Get 1-2 nudges a week + a personal opener. |

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** Prisma 7 + SQLite (works locally; swap to Vercel Postgres or Turso for prod)
- **Auth:** email + password with bcrypt, JWT cookie via jose
- **AI:** OpenRouter (claude-3.5-haiku by default — fast + cheap)
- **Payments:** Stripe stub (test mode, see `src/lib/stripe.ts`)
- **Styling:** Tailwind 4 with a custom warm palette — no AI-slop design

## Run it

```bash
pnpm install
cp .env.example .env   # add your OPENROUTER_API_KEY
pnpm exec prisma migrate dev
pnpm dev               # http://localhost:3000
```

## Layout

```
src/
├── app/
│   ├── page.tsx              # Landing (4-app directory)
│   ├── signup/, login/       # Auth
│   ├── a/  b/  c/  d/        # The 4 apps (one folder each)
│   ├── account/              # Account + pricing
│   └── api/                  # JSON endpoints
├── lib/
│   ├── db.ts                 # Prisma client (better-sqlite3 adapter)
│   ├── auth.ts               # signUp, logIn, getSession, requireUser
│   ├── ai.ts                 # OpenRouter + NO_SLOP_RULES
│   └── stripe.ts             # Pricing constants + Stripe stub
└── generated/prisma/         # Prisma 7 client output
```

## Design rules (do not break)

1. **No AI-slop copy.** Banned words list is enforced in `src/lib/ai.ts`. No em-dashes, no "delve", no "leverage", no "transformative", no "AI-powered" badges.
2. **No gradient/glow/glassy UI.** Plain rounded corners, cream background, forest accent, serif headings. See `src/app/globals.css`.
3. **No streaks, badges, or engagement loops.** These are tools, not games.
4. **Each app has its own data, its own pricing, its own URL.** A user can subscribe to one and ignore the others.
5. **Free tier exists for all 4 apps.** A user can try before paying.

## What it costs to run

Per active user per month, at moderate use (5 AI calls per week per app):
- AI: ~$0.05–0.15/user
- DB: covered by free tier
- Hosting: covered by Vercel hobby tier until ~1000 users
- Email (when wired): ~$0.001/user

## What it costs to ship

- Domain: $12/year
- Vercel hobby: $0
- OpenRouter: pay-as-you-go, ~$5 covers first 100 active users
- Stripe: 2.9% + 30¢ per transaction

## TODO before public launch

- [ ] Swap SQLite → Vercel Postgres (or Turso)
- [ ] Wire Stripe checkout (server has stub; needs live keys + webhook)
- [ ] Add Resend for the Still Here Sunday email
- [ ] Add flyer image upload for Tag In
- [ ] Add fridge photo upload for Tonight
- [ ] Buy a domain
- [ ] Set up Sentry or similar for error tracking
- [ ] Write a privacy policy
- [ ] Write a terms of service
- [ ] Get a real Stripe account
