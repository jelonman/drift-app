# Four — State

**Live URL:** https://drift-app-gamma.vercel.app
**GitHub:** https://github.com/jelonman/drift-app (currently public; can be made private once Vercel GitHub App is granted access)
**Vercel project:** `jelonmans-projects/drift-app` (hobby plan)
**Database:** Neon (free v3) — `curly-wave-21703969` (auto-provisioned by Vercel marketplace integration)
**Region:** us-east-1

## What's here

```
drift-app/
├── prisma/
│   ├── schema.prisma            # SQLite (local dev)
│   ├── schema.postgres.prisma   # PostgreSQL (Vercel prod)
│   ├── migrations/              # SQLite init migration
│   └── dev.db                   # local SQLite (gitignored)
├── src/lib/
│   ├── db.ts                    # Provider-aware Prisma client (lazy via Proxy)
│   ├── auth.ts                  # jose JWT, bcrypt
│   ├── ai.ts                    # OpenRouter + NO_SLOP_RULES
│   └── stripe.ts                # stub
├── src/app/                     # 31 routes (landing, 4 apps, auth, account, 9 API endpoints)
├── src/generated/prisma/        # Prisma 7 client (gitignored)
├── vercel.json                  # Build command: schema swap + generate + next build
├── .env.example                 # Template (committed)
└── .env                         # Local secrets (gitignored)
```

## The four apps

| App | Slug | What it does | Free tier | Paid |
|---|---|---|---|---|
| **Three Dots** | `/a` | Paste a chat → 4 reply options + coaching on the hesitation | 5/mo | $7/mo |
| **Tag In** | `/b` | Drop a messy note → tasks split between partners + draft reply | 14 days | $9/mo/family |
| **Tonight** | `/c` | List pantry → 5-night meal plan + grouped grocery list | 3/mo | $5/mo |
| **Still Here** | `/d` | Add friends → Sunday nudge + 3 personal openers | 3 friends | $5/mo |

## Stages complete

- [x] **Research** — 5 parallel subagents
- [x] **Demand validation** — name collision on "Drift" surfaced; renamed Still Here
- [x] **Architecture** — Next.js 16 + Prisma 7 + SQLite (local) + Postgres (prod) + OpenRouter + Stripe stub
- [x] **Brand + design system** — warm cream/forest palette, serif headings, no AI-slop
- [x] **Auth** — sign up, log in, JWT cookie, bcrypt, getSession
- [x] **AI integration** — OpenRouter with claude-3.5-haiku, NO_SLOP_RULES enforced
- [x] **App A: Three Dots** — paste conversation → 4 tones + coaching note
- [x] **App B: Tag In** — drop messy note → task split with fair-load awareness + draft reply
- [x] **App C: Tonight** — list pantry → 5 meals with leftover rotation + grouped grocery list
- [x] **App D: Still Here** — add friend + touch history → 3 personal openers
- [x] **Account page** — shows all 4 apps, pricing
- [x] **Local production build** — 31 routes compile clean
- [x] **Vercel deploy** — live at https://drift-app-gamma.vercel.app
- [x] **Vercel Postgres (Neon)** — auto-provisioned via marketplace integration, schema applied
- [x] **Env vars set on Vercel** — OPENROUTER_API_KEY, JWT_SECRET, NEXT_PUBLIC_SITE_URL, all POSTGRES_* from Neon
- [x] **Production E2E tested** — signup works, all 4 apps generate real AI output, tasks persist across requests
- [ ] **Stripe wiring** — server has stub, needs keys + checkout session endpoint
- [ ] **Image/voice upload for B** — schema supports it, UI currently text-only
- [ ] **Umbrella domain** — site is on Vercel subdomain for now; user to decide on a personal umbrella domain

## Files created / changed (this session)

```
drift-app/
├── .gitignore                                 (added: /dev.db, !.env.example exception)
├── .env.example                               (NEW — template for env vars)
├── prisma/schema.postgres.prisma              (NEW — Postgres provider)
├── src/lib/db.ts                              (lazy Prisma via Proxy, provider-aware)
├── vercel.json                                (NEW — build command)
└── package.json                               (added @prisma/adapter-pg, pg, @types/pg)
```

## Vercel environment

Project: `jelonmans-projects/drift-app` (`prj_GuPs9pnErl4DBmEeCfvc6bCGuqG8`)
Build command: `cp prisma/schema.postgres.prisma prisma/schema.prisma && pnpm exec prisma generate && pnpm exec next build`
Production URL: `https://drift-app-gamma.vercel.app`

Env vars on Vercel (production):
- `DATABASE_URL` — Neon pooler URL
- `DATABASE_URL_UNPOOLED` — Neon direct URL
- `POSTGRES_PRISMA_URL` — Prisma-friendly URL
- `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL`
- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_DATABASE`
- `PGHOST`, `PGUSER`, `PGDATABASE`, `PGHOST_UNPOOLED`, `PGPASSWORD`
- `NEON_PROJECT_ID` = `curly-wave-21703969`
- `NEON_AUTH_BASE_URL` = `provisioning`
- `OPENROUTER_API_KEY` — production AI key
- `OPENROUTER_MODEL` — `anthropic/claude-3.5-haiku` (or set in env)
- `JWT_SECRET` — 48-byte random base64
- `NEXT_PUBLIC_SITE_URL` = `https://drift-app-gamma.vercel.app`
- (Vercel added: `VITE_NEON_AUTH_URL`)

## Caveats

- **DB is Neon free tier (256MB).** Will hold up to ~100k users with our data shapes. Auto-scales when you upgrade.
- **Stripe is stubbed.** The pricing constants are real. To enable paid tiers: add Stripe keys, create a checkout endpoint, wire the webhook. The UI already shows the pricing on `/account`.
- **GitHub repo is public.** The team's Vercel GitHub App doesn't have access to private repos in the user's account. Easy fix: install the Vercel GitHub App for the `jelonman` user at https://github.com/settings/installations and grant it access to `drift-app`. Then `gh repo edit --visibility private` to take it back to private.
- **App B's "voice memo" and App C's "snap fridge" are not yet implemented.** Both are text-only for now. The schema and AI prompts are ready for the multimodal upgrade.
- **App D's "Sunday check-in" doesn't have an email yet.** Would need Resend or similar.
- **No image hosting.** Friend avatars, flyer snapshots — none wired. Skip for now.
- **OpenRouter model is `claude-3.5-haiku`** (~$0.80/1M in, ~$4/1M out). Fast + cheap. Upgrade to Sonnet 4.5 if quality needs it.

## Next steps

1. **Install the Vercel GitHub App on the user's GitHub account** → unblock auto-deploys on push + repo can be made private. (User action, 2 min.)
2. **Wire Stripe test mode.** Test card 4242 4242 4242 4242.
3. **Add Resend for the Still Here Sunday email.** Cheap, 5-min setup.
4. **Pick an umbrella domain.** The site is at `drift-app-gamma.vercel.app` for now. Buy one domain (e.g. `quiet.tools`) and forward `/four/*` to the Vercel URL. (Or buy `jelonman.com` and put all projects under it.)
5. **Image upload for B and C.** Schema supports it; just add multipart form handling + Vercel Blob.
6. **Update `~/autonomous-income-lab/STATE.md`** to note the new drift-app project.

## Umbrella domain options (to discuss with user)

The user wants ONE domain that doesn't point to a single product, and can forward to all their projects. Options:

| Domain | TLD | Notes |
|---|---|---|
| `jelonman.com` | .com | Personal. Most "credible" but likely taken or expensive aftermarket. |
| `jelonman.dev` | .dev | Personal + developer-leaning. Usually cheap ($12/yr). |
| `jelonman.work` | .work | Personal + project-feel. Usually cheap. |
| `jelonman.io` | .io | Personal + startup-y. Slightly more expensive ($30-50/yr). |
| `quiet.tools` | .tools | Matches the brand voice ("Built quietly"). $20-30/yr. |
| `small.tools` | .tools | Matches the philosophy (small AI tools). Likely taken. |
| `piotr.tools` | .tools | Personal + tools. $20-30/yr. (User's first name per `piosarna@outlook.com`.) |
| `make.tools` | .tools | Generic. Almost certainly taken. |

Best cheap options: `jelonman.dev`, `jelonman.work`, `quiet.tools`, `piotr.tools`. The `.tools` TLD is the most thematic but the most exposed to scams. The `.dev` TLD is the cheapest and most credible for a portfolio of small apps.

## Evidence

- Production URL: https://drift-app-gamma.vercel.app — HTTP 200 on landing, /a, /b, /c, /d, /signup, /login
- Real signup works: created `prodtest1@example.com` on production DB
- All 4 apps return real AI output on production
- DB queries return data: Conversation created (`cmpwalwa4000104jm8rt1a6ij`), Family created (`cmpwamr4z000004kz2xeb4hyc`), Drop created (`cmpwan8iw000604kzvv4xldgu`), Plan created (`cmpwaoij7000704kzjxee0v0i`), Friend created (`cmpwaothz000804kz150ngm7h`)
- AI reply from A: "You're stuck because saying 'yes' feels like making a big commitment, when it's actually just a coffee" + 4 distinct reply options
- AI tasks from B: 5 tasks extracted from messy parent note, split between You/Partner
- AI meals from C: 5 days generated, ingredients from pantry used
- AI openers from D: 3 personal openers referencing "indie folk" + "new baby" context

## Local commands

```bash
cd ~/drift-app
pnpm install                  # install deps
pnpm dev                      # http://localhost:3000 (uses local SQLite)
vercel env pull .env.local    # pull production env vars (if needed locally)
vercel logs                   # tail production logs
vercel deploy --prod --yes    # manual redeploy
```
