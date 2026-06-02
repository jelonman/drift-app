# omicron.ink — Live State

## Status: Live at omicron.ink

Production URL: https://omicron.ink

**All planned features shipped. Domain bought and resolving. End-to-end Stripe verified. Vercel Blob live. Resend wired (sandbox until domain verify). 4 apps verified working on production.**

## Stages complete
- [x] 4 apps (Three Dots, Tag In, Tonight, Still Here) wired with OpenRouter AI
- [x] Auth (JWT, bcrypt) on Postgres (Neon)
- [x] Per-app free tier enforcement (HTTP 402 + needsSubscription)
- [x] Stripe checkout + webhook + portal (test mode, 4 products/prices)
- [x] Resend emails (welcome, receipt, cancel, Sunday digest) — test-mode filter removed; sandbox sender used until domain verified
- [x] Vercel Blob image upload (B school flyer, C fridge photo, 5MB max, JPEG/PNG/WebP/HEIC)
- [x] Drop model replaces the __drop__ hack in Task table
- [x] Marketing pages for /, /a, /b, /c, /d
- [x] OG images (5) + favicon + apple-icon (dynamic Next.js ImageResponse)
- [x] /privacy, /terms, /help, /pricing, /changelog
- [x] /sitemap.xml, /robots.txt, full metadata
- [x] @vercel/analytics
- [x] /error, /global-error, /not-found
- [x] Sunday cron for Still Here digest (with bearer auth)
- [x] Full E2E verified: signup → checkout → webhook → DB → UI unlock
- [x] Cron auth: 200 with secret, 401 without
- [x] Domain `omicron.ink` bought (Vercel registrar, 1yr, $2.99, autoRenew off)
- [x] Domain added to project; NEXT_PUBLIC_SITE_URL env updated
- [x] Brand updated from "Four" to "omicron" across all source

## Files created/changed (key)
- `src/lib/{db,auth,ai,stripe,email,limits}.ts`
- `src/app/api/auth/{signup,login,logout}/route.ts`
- `src/app/api/billing/{checkout,portal,webhook}/route.ts`
- `src/app/api/cron/still-here-digest/route.ts`
- `src/app/api/upload/route.ts` (new)
- `src/app/{a,b,c,d}/{page.tsx,new,opengraph-image.tsx}`
- `src/app/account/{page.tsx,billing-actions.tsx}`
- `src/app/{pricing,changelog,help,privacy,terms}/page.tsx`
- `src/components/marketing/{hero,how-it-works,for-who,sample-output,faq,final-cta}.tsx`
- `prisma/schema.prisma` (SQLite) + `prisma/schema.postgres.prisma`
- `prisma/migrations/` (Postgres, used in Vercel build)
- `prisma/migrations-sqlite/` (SQLite, used in local dev)
- `vercel.json` (buildCommand: copy schema + generate + migrate deploy + build; Sunday cron)
- `launch-content/LAUNCH-POSTS.md` (drafts for r/SoloFounders, r/IndieHackers, Indie Hackers, X thread, ProductHunt)

## Stripe (test mode)
- Account: acct_1NLKbzAmjxBammkc
- 4 products: Three Dots Pro ($7), Tag In Family ($9), Tonight Unlimited ($5), Still Here Plus ($5)
- Webhook: we_1TdoBFAmjxBammkcTH64jKc6 → /api/billing/webhook
- All 8 env vars set on Vercel production

## Vercel Blob
- Store: drift-uploads (public, iad1)
- BLOB_READ_WRITE_TOKEN env var set on prod
- /api/upload route: 5MB max, JPEG/PNG/WebP/HEIC, per-user path prefix

## Cron
- Schedule: 0 13 * * 0 (Sundays 13:00 UTC)
- Auth: Bearer ${CRON_SECRET}
- Tested: 200 with secret, 401 without

## Resend
- 4 send functions (welcome, receipt, cancel, digest) wired
- Test-mode filter REMOVED. Will attempt all recipients. Resend sandbox (onboarding@resend.dev) will reject non-owner with 403, but signup still completes and DB still updates.
- Once domain verified at Resend, update RESEND_FROM_EMAIL=hello@omicron.ink and all sends land.

## Domain
- `omicron.ink` bought via Vercel registrar, $2.99 first year, autoRenew off
- Expires 2 June 2027
- Added to project (verified: true)
- Intended nameservers: ns1.vercel-dns.com, ns2.vercel-dns.com (propagating)
- .ink TLD nameservers from registry a.nic.ink etc. need to point to Vercel. Fresh registration, may take 30min–2h.
- NEXT_PUBLIC_SITE_URL env var updated to https://omicron.ink

## Caveats
- DNS propagation: omicron.ink may not resolve for ~1-2h. drift-app-gamma.vercel.app still works.
- Stripe is in test mode — switch to live keys + new prices + new webhook for production
- Vercel Blob store is provisioned, but B and C uploads are the only ones using it
- Resend sandbox sender is `onboarding@resend.dev` (works only to account owner) until domain verified

## Next steps
1. **Wait for DNS propagation** for omicron.ink (1-2h), then verify domain in Resend dashboard
2. **Update RESEND_FROM_EMAIL env** to `hello@omicron.ink` once Resend verifies the domain
3. **Stripe live mode**: swap `sk_test_` for `sk_live_` + new prices + new webhook
4. **Distribution**: post on r/SoloFounders, r/IndieHackers, Indie Hackers, X (drafts in launch-content/LAUNCH-POSTS.md)

## Hard-stops
None currently. All routine infra work complete. Awaiting DNS propagation.

## Cleanup if aborting
- `vercel rm drift-app`
- `gh repo delete jelonman/drift-app`
- Disconnect Neon in Vercel dashboard
- Delete Vercel Blob store `drift-uploads` in dashboard
- Archive 4 Stripe products + delete webhook in dashboard
- Remove Resend API key from Vercel env
- Domain omicron.ink will auto-expire in 1 year (autoRenew off)
