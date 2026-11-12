# Accounting and tax landing page: where it stands

Last updated: November 11, 2026 (evening, Central). Branch: `accounting-page`.

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
- `mail_pipeline`: view, one row per business with visits, request, last follow-up and `next_step`.
- Functions: `log_scan(p_slug)`, `advance_lead_stage(p_slug, p_stage)`, `stage_rank(s)`.

The site reads `DATABASE_URL` (set in Vercel for preview and production as a hidden value). All queries go through `lib/db.ts` with `@neondatabase/serverless`. Never print or commit the connection string.

As of this update `leads` holds 90 rows: 20 accounting, 20 tax prep, and 50 law firms (niche `legal`, segment `law firm`) that ChatGPT added. **The 50 law firms have no page on this branch yet and would show the dentist page.**

## How a visit is recorded

1. `app/[slug]/page.tsx` looks the business up, counts the scan (`log_scan`) and sends the scan webhook.
2. `instrumentation-client.ts` posts to `/api/visit` (a `visit` row plus a Telegram alert) and, on leaving, to `/api/visit/end` (time on page, scroll depth, taps).
3. The quote pop-up calls `submitAccountingRequest` in `app/actions.ts`: saves the request, logs `form_submit`, moves the stage to `requested_info`, sends the alerts.

Alerts: Telegram is set for preview and production. The GoHighLevel webhook is set for production only, so preview tests do not reach the CRM.

## Page layout today

1. Header: logo, "Get my quote", call button with the Bryan line (979) 779-2998.
2. Hero: "Prepared for", business name, headline, Leroy photo, "Start my quote".
3. "Make the paperwork part easier": three benefit sections, each with a label, title, photo, text and a button.
4. About CTWP: flag photo, "Serving Bryan–College Station since 1979", Customers for Life line, four customer logos.
5. "Your local copier company": route map from the business to the office, directions button, "Ask us about service".
6. Badges, "Let's find the right fit for <business>", one "Start my quote" button.

The quote form is a pop-up (`components/AccountingQuote.tsx`) opened by every quote button and any `#quote` link. Three steps: what to help with (pick any), timing, then name and contact with optional copier details. A benefit button opens it with that topic already checked.

The pop-up's look and the three benefit photos came from ChatGPT's concept on branch `design/accounting-opening-v1` (route `/accounting-opening`). That branch also has a newer Leroy office photo (`public/accounting-opening/leroy-office-v2.webp`) that is not used here.

## Open items

- **Local section wording.** Nick has not picked the paragraph. The page still has the older sentence. The three options offered were:
  1. "We're right here in Bryan, close to your office. Come by anytime to see the equipment and meet us in person. And when you need service, we're just a few minutes away."
  2. "We're close by, right here in Bryan. Come see the equipment anytime. And when you need service, help is a few minutes away."
  3. "Our office is right here in Bryan, a short drive from yours. You're welcome to come by anytime to see the equipment and meet the team. When you need service, we're only a few minutes away."
- **Law firm page** on this design for the 50 legal leads. Needs copy from Nick, or a draft for him to approve first.
- **Test data to clear before mailing** (ask Nick before deleting anything): test visits on `seidelschroeder` and `rosettataxservice` (both now at stage `scanned` with `qr_scans` above zero), and two requests named "TEST Claude…" under slug `example-accounting-group`.
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
