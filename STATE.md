# Drift App — Live State

## Status: Launch Ready (Test Mode)

Production URL: https://drift-app-gamma.vercel.app

**All launch work done. End-to-end Stripe checkout verified 2026-06-02.**

## Stages complete
- [x] 4 apps (Three Dots, Tag In, Tonight, Still Here) wired with OpenRouter AI
- [x] Auth (JWT, bcrypt) on Postgres (Neon)
- [x] Per-app free tier enforcement (HTTP 402 + needsSubscription)
- [x] Stripe checkout + webhook + portal (test mode)
- [x] Resend emails (welcome, receipt, cancel, Sunday digest)
- [x] Marketing pages for /, /a, /b, /c, /d
- [x] OG images (5) + favicon + apple-icon (dynamic Next.js ImageResponse)
- [x] /privacy, /terms, /help
- [x] /sitemap.xml, /robots.txt, full metadata
- [x] @vercel/analytics
- [x] /error, /global-error, /not-found
- [x] Sunday cron for Still Here digest
- [x] Full E2E verified: signup → checkout → webhook → DB → UI unlock

## Files created/changed (key)
- `src/lib/{db,auth,ai,stripe,email,limits}.ts`
- `src/app/api/auth/{signup,login,logout}/route.ts`
- `src/app/api/billing/{checkout,portal,webhook}/route.ts`
- `src/app/api/cron/still-here-digest/route.ts`
- `src/app/{a,b,c,d}/{page.tsx,new,opengraph-image.tsx}`
- `src/app/account/{page.tsx,billing-actions.tsx}`
- `src/components/marketing/{hero,how-it-works,for-who,sample-output,faq,final-cta}.tsx`
- `prisma/schema.prisma` (SQLite) + `prisma/schema.postgres.prisma`
- `vercel.json` (buildCommand + Sunday cron)

## Stripe (test mode)
- Account: acct_1NLKbzAmjxBammkc
- 4 products: Three Dots Pro ($7), Tag In Family ($9), Tonight Unlimited ($5), Still Here Plus ($5)
- Webhook: we_1TdoBFAmjxBammkcTH64jKc6 → /api/billing/webhook

## Vercel env vars (production)
- OPENROUTER_API_KEY, JWT_SECRET, NEXT_PUBLIC_SITE_URL
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_A/B/C/D
- RESEND_API_KEY, CRON_SECRET

## Caveats
- Stripe is test mode — switch to live keys + new prices + new webhook for production
- Resend uses onboarding@resend.dev (verify custom domain later for branding)
- Vercel Blob store not provisioned (B and C have upload UI ready but disabled)
- 4 products already in Stripe dashboard (visible to anyone with the test account)

## Next steps
1. Domain: jelonman.dev (~$12/yr) and connect to Vercel
2. Resend domain verification for branded from address
3. Vercel Blob store provisioning + enable B/C upload
4. Stripe live mode (swap keys, new prices, new webhook)
5. First real users (3 Reddit + 1 Indie Hackers + 1 X post — see /root/repos/launch-plans)

## Evidence summary
- All 4 apps produce real AI content (A=4 tones, B=5 tasks, C=5-day plan, D=3 openers)
- Stripe test checkout creates real checkout.stripe.com URLs
- Webhook 200 on every event
- DB subscriptions created and canceled correctly
- Account page shows correct state per app
- Free tier still enforced on unpaid apps

## Hard-stops
None currently. All required work complete in test mode.

## Cleanup if aborting
- `vercel rm drift-app`
- `gh repo delete jelonman/drift-app`
- Disconnect Neon in Vercel dashboard
- Archive 4 Stripe products in dashboard
- Remove webhook in dashboard
