# Four — State

**Live session:** 2026-06-01
**What was built:** Four fully working consumer AI apps in one Next.js monorepo, each at its own URL, each with its own data model, AI behavior, and pricing.

## What's here

```
drift-app/
├── prisma/schema.prisma     # 9 models: User + 4 app data models
├── src/lib/
│   ├── db.ts                # Prisma + better-sqlite3 (works locally + Turso for prod)
│   ├── auth.ts              # email+password, JWT cookie, bcrypt
│   ├── ai.ts                # OpenRouter client, NO_SLOP_RULES, json-mode helper
│   └── stripe.ts            # stub for now (test-mode ready, needs keys)
├── src/app/
│   ├── page.tsx             # Landing (directory of 4 apps)
│   ├── signup, login        # auth pages
│   ├── a/                   # Three Dots (texting anxiety coach)
│   ├── b/                   # Tag In (parent load balancer)
│   ├── c/                   # Tonight (dinner decider)
│   ├── d/                   # Still Here (friendship drift coach)
│   └── api/                 # JSON endpoints for each app
```

## The four apps

| App | Slug | What it does | Free tier | Paid |
|---|---|---|---|---|
| **Three Dots** | `/a` | Paste a chat → 4 reply options + coaching on the hesitation | 5/mo | $7/mo |
| **Tag In** | `/b` | Drop a messy note → tasks split between partners + draft reply | 14 days | $9/mo/family |
| **Tonight** | `/c` | List pantry → 5-night meal plan + grouped grocery list | 3/mo | $5/mo |
| **Still Here** | `/d` | Add friends → Sunday nudge + 3 personal openers | 3 friends | $5/mo |

## Stages complete

- [x] **Research** — 5 parallel subagents, 4 convergent consumer pains
- [x] **Demand validation** — name collision on "Drift" surfaced (renamed to "Still Here"); category crowded but no AI-opener leader
- [x] **Architecture** — Next.js 16 + Prisma 7 + SQLite + NextAuth-style cookies + OpenRouter + Stripe stub
- [x] **Brand + design system** — warm cream/forest palette, serif headings, no AI-slop
- [x] **Auth** — sign up, log in, JWT cookie, bcrypt, getSession helper
- [x] **AI integration** — OpenRouter with claude-3.5-haiku (cheap, fast, good)
- [x] **App A: Three Dots** — paste conversation → 4 tones + coaching note
- [x] **App B: Tag In** — drop messy note → task split with fair-load awareness + draft reply
- [x] **App C: Tonight** — list pantry → 5 meals with leftover rotation + grouped grocery list
- [x] **App D: Still Here** — add friend + touch history → 3 personal openers + mark contacted
- [x] **Account page** — shows all 4 apps, pricing, free tier status
- [x] **Production build** — 31 routes compile clean
- [x] **End-to-end test** — all 4 apps generate real, varied, on-tone AI output
- [ ] **Stripe wiring** — server has stub, needs keys + checkout session endpoint
- [ ] **Image/voice upload for B** — schema supports it, UI currently text-only
- [ ] **Deploy to Vercel** — needs Vercel Postgres (or Turso) for prod DB

## Files created / changed

```
drift-app/                                   # NEW directory
├── .env                                     # OpenRouter key set, JWT secret, Stripe placeholders
├── package.json                             # next 16, prisma 7, openai (for OpenRouter), stripe, jose, bcryptjs, zod, react-markdown, lucide-react
├── prisma/
│   ├── schema.prisma                        # 9 models
│   ├── dev.db                               # SQLite, migrated
│   └── migrations/20260601205630_init/
├── src/
│   ├── app/                                 # 31 routes
│   ├── lib/{db,auth,ai,stripe}.ts
│   └── generated/prisma/                    # Prisma 7 client output
```

## Caveats

- **DB is local SQLite.** For production deploy, swap to Vercel Postgres or Turso. The Prisma client already uses the adapter pattern, so it's a one-line change.
- **Stripe is stubbed.** The pricing constants are real. To enable paid tiers: add Stripe keys, create a checkout endpoint, wire the webhook. The UI already shows the pricing on `/account`.
- **App B's "voice memo" and App C's "snap fridge" are not yet implemented.** Both are text-only for now. The schema and AI prompts are ready for the multimodal upgrade.
- **App D's "Sunday check-in" doesn't have an email yet.** Would need Resend or similar. The data is there; the trigger isn't.
- **No image hosting.** App D's friend avatars, App B's flyer snapshots — none of that is wired. Skip for now.
- **OpenRouter model is `claude-3.5-haiku`** (~$0.80/1M tokens in, ~$4/1M out). Fast + cheap. Upgrade to Sonnet 4.5 if quality needs it.

## Next steps

1. **Decide which app to push as the lead.** Right now they're all four equal siblings. Pick one (probably D — Still Here, since it's the most original and the user's pick) and put the marketing effort there.
2. **Wire Stripe.** Test card 4242 4242 4242 4242. Goal: a user can hit "Subscribe" and actually pay.
3. **Add Resend for the Sunday email.** Cheap, 5-min setup. Then App D has a real recurring hook.
4. **Deploy to Vercel.** Push to a new repo, add Vercel Postgres, set env vars, ship.
5. **Pick a primary domain.** Right now: localhost:3000/{a,b,c,d}. Buy a domain (e.g. `four.app` or `tryfour.com`) and point Vercel at it.

## Evidence

- All 4 apps return HTTP 200 on their main pages
- All 4 API endpoints successfully call OpenRouter and persist results
- Production build: 31 routes, 0 errors, 0 warnings
- Real AI output verified for all 4 (see conversation history for sample replies)
- Each app uses the same NO_SLOP_RULES system prompt to keep the output human and on-brand
