# Accounting and tax landing page: where it stands

Last updated: November 12, 2026. Branch: `design/accounting-v2-focus` (from `accounting-page`).

Read this before working on the accounting, tax or any new niche page.

## What it is

Each business on the mailing list gets its own page at `/<slug>`. The slug is the link ending printed on the mailer and in the QR code. There are no individual pages: one template, filled in from the database.

- **Niche picks the page.** `accounting` renders `components/AccountingLanding.tsx`. Any other niche still falls back to the dentist page (`components/Landing.tsx`).
- **Segment picks the wording.** Inside the accounting niche, segment `tax prep` gets the `TAX` copy and anything else gets `ACCOUNTING`. Both are in `lib/accounting.ts`; the lookup is `accountingCopy(segment)`.
- **To add a niche** (construction, legal on this design, and so on): add its copy file and page component, then add one `case` to `NichePage` in `app/[slug]/page.tsx`. Segments inside it only change wording.

## Links

- Preview (follows this branch): `https://ctwpmail-git-accounting-page-n14967744-2024.vercel.app`
- Real examples: `/seidelschroeder` (accounting), `/rosettataxservice` (tax prep)
- Made-up examples that touch no real business: `/accounting-review`, `/tax-review`
- Previews are behind Vercel sign-in. Make a no-sign-in link with the Vercel connector's share-link tool. A share link lasts about 23 hours and **can stop working after a new deployment** (it did once on Nov 11), so check or remake it after every push and always hand Nick a link he can tap.
- Vercel project `ctwpmail` (`prj_0eJ5uluwER6xON3ejdqwdLVx8rdm`), team `team_6Jvt5GK2EKBVZiSUz4RMiasL`. Pushing this branch deploys the preview.

## Database

Neon project **ctwp-mail** (`restless-star-70875975`), database `mail`, branch `main`, schema `public`. This branch no longer uses Supabase.

- `leads`: one row per business. `slug`, `name`, `niche` are required. `segment`, `address`, `city`, `zip` drive the wording and the map.
- `landing_events`: page visits and form submits.
- `landing_requests`: quote requests (`answers` holds help, timing, equipment, spend, contactType).
- `lead_followups`: follow-up log.
- `landing_request_photos`: copier photos added after a request (`request_id`, `content_type`, `bytes`). Created Nov 11; the SQL is in `db/2026-11-11_request_photos.sql`. Photos are not on a public URL; Telegram also gets a copy.
- `mail_pipeline`: view, one row per business with visits, request, last follow-up and `next_step`.
- Functions: `log_scan(p_slug)`, `advance_lead_stage(p_slug, p_stage)`, `stage_rank(s)`.

The site reads `DATABASE_URL` (set in Vercel for preview and production as a hidden value). All queries go through `lib/db.ts` with `@neondatabase/serverless`. Never print or commit the connection string.

As of this update `leads` holds 90 rows: 20 accounting, 20 tax prep, and 50 law firms (niche `legal`, segment `law firm`) that ChatGPT added. **The 50 law firms have no page on this branch yet and would show the dentist page.**

## How a visit is recorded

1. `app/[slug]/page.tsx` looks the business up, counts the scan (`log_scan`) and sends the scan webhook.
2. `instrumentation-client.ts` posts to `/api/visit` (a `visit` row plus a Telegram alert) and, on leaving, to `/api/visit/end` (time on page, scroll depth, taps).
3. The quote pop-up calls `submitAccountingRequest` in `app/actions.ts`: saves the request, logs `form_submit`, moves the stage to `requested_info`, sends the alerts.

Alerts: Telegram is set for preview and production. The GoHighLevel webhook is set for production only, so preview tests do not reach the CRM.

## Page layout today (branch `design/accounting-v2-focus`, "focus" version)

About five phone screens, one idea each. Wording for both segments is in `lib/accounting.ts`; TAX is written separately and leads with the season.

1. Header (`components/AccountingChrome.tsx`, not the dentist `Header.tsx`): 60px, wide logo ("Your copier company"), the Bryan line. On wide screens a small "Get my quote" joins once the hero button has scrolled away.
2. Hero: "Prepared for" + business name (h1), Leroy photo with the caption "Leroy, our office dog", one statement (what CTWP is: copiers from Bryan, own technicians), "Get my quote", "Three questions. Then someone from our Bryan office calls you." The photo gives up height first, so the button stays on the first screen with a long name.
3. The quote's first question: a lead line "CTWP has served accounting and tax offices in Texas since 1979." (Nick's line, Nov 12), then the question tied to tax season and five large rows. A row opens the pop-up at step 2 with that choice saved.
4. Featured Kyocera TASKalfa 5053i and three-tier color: three drawn pages (a little color, some color, full color) that "print" out of a slot when scrolled to. No prices. Wording and featured model await Ryan's confirmation (`FEATURED` in `lib/accounting.ts`).
5. Four short benefits: one-pass scanning, private client records (secure print), monthly cost, the busy weeks.
6. Proof: "Sold, leased and serviced from Bryan.", route map from the business (not draggable on touch screens), "Directions" link, four customer logos, four badges in one row.
7. Why now (before tax season) and the closing "Get my quote" with the phone number.
8. Footer: Bryan office in full; the other six offices as a compact list with phone numbers.

Phones get a bottom action bar ("Get my quote") after the hero, hidden again at the closing ask and footer. Red is used only for that one action. The action has one name everywhere: "Get my quote"; after a request is sent, page buttons say "Quote requested" and reopen the thank-you screen.

Motion: one load sequence in the hero (Leroy settles, words rise), short rises on scroll (`components/Reveal.tsx`, elements marked `data-reveal`; anything already on screen shows at once), the printing pages, the bottom sheet. All of it is off with `prefers-reduced-motion`, and nothing is hidden without JavaScript.

The three stock benefit photos, the flag photo and the machine slideshow are no longer on the page (files kept; `ModelShowcase.tsx` and its CSS remain for other versions).

The quote form is a pop-up (`components/AccountingQuote.tsx`). On phones it is a bottom sheet whose main button is pinned at the bottom and rides above the keyboard (it reads `visualViewport`). Three steps: what to help with (any), timing (one tap advances), name and phone or email. The business name is sent from the page, not asked. Return in the name field moves to the phone field; Return in the phone field sends. Errors clear as soon as the visitor types. "Next" with nothing chosen says what is missing instead of being disabled. It still calls `submitAccountingRequest` with the same fields.

After the request is sent, the thank-you screen offers the optional "Add copier details" step: a photo of the label, current provider, make and model, serial number, lease end and monthly cost. `addRequestDetails` in `app/actions.ts` merges them into the same request's `answers` (keys `provider`, `equipment`, `serial`, `leaseEnd`, `spend`, `photo`), stores the photo and sends Telegram. Return in a details field moves to the next field and never sends. These details do not go to the GoHighLevel webhook yet.

Help options saved in `answers.help` now read like the visitor talking ("I want to check what I’m paying"), and differ between ACCOUNTING and TAX.

## Open items

- **Ryan to confirm:** the three-tier color wording and that the TASKalfa 5053i is the machine to feature.
- **Seasonal wording:** the "before tax season / before January" lines suit a November to January mailing. Revisit after January.
- **"Meet Leroy" section:** an idea Nick wants to hold for later.
- **Law firm page** on this design for the 50 legal leads. Needs copy from Nick, or a draft for him to approve first.
- **Test data to clear before mailing** (ask Nick before deleting anything): test visits on `seidelschroeder` and `rosettataxservice` (both now at stage `scanned` with `qr_scans` above zero), and three requests named "TEST Claude…" under slug `example-accounting-group` (one has a test photo).
- **Do not merge this branch into `main` yet.** `main` is the live dentist site and still reads Supabase. Merging would point the live site at Neon, where the dentist leads do not exist.
- **Permission to show customer logos** (Texas A&M in particular) and whether the badge years should say 2026: raised with Nick, not answered.
- **Connection string rotation:** the string passed through an assistant session's tool log when it was copied from Neon to Vercel. Rotation was offered to Nick and not requested.
- Branch `design/accounting-options` holds rejected designs and can be deleted on GitHub.

## Working with Nick on this page

These come from his feedback while the page was built.

- Colors come only from the CTWP logo: navy `#002454`, red `#b41830`, white, black. No cream, gray or gold.
- Headings are bold Outfit (the sans). Do not add new Google fonts; the Vercel build failed when two were added.
- Change one section at a time, show it, and wait. Do not redesign parts he did not ask about, and do not change images unless asked.
- For wording, show the words first and build after he picks. He wants it professional and slightly casual, not salesy.
- No claims in the hero about years in business. No invented savings, guaranteed response times, instant pricing or automatic filing into accounting software.
- He reads on a phone. Check the phone layout first and always give a link.

## Checking a change

```
npx tsc --noEmit
npx next build
npx next start -p 3311     # /accounting-review and /tax-review work without a database
```

Without `DATABASE_URL` the real slugs show "not found" and the pop-up answers "Something went wrong", which is expected locally. Test saving on the preview from `/accounting-review`, which touches no real business.
