# CTWP Campaign Design and Personalization Plan

Build a reusable CTWP mail-campaign landing system that feels deliberately made for each recipient. Approve the message, responsive layout and personalization rules before producing final artwork. Desktop option D’s wider text is selected; mobile alternatives are the next design round. The three Leroy image directions remain part of the plan.

[Live hero comparison](https://ctwpmail.vercel.app/hero-review#d) · [Current customer page](https://ctwpmail.vercel.app/universitydentalassociates)

# Decisions and order of work

Separate decisions that affect the page structure from finishing touches. The message and rough copy length must be settled early because they determine how much space the design needs. Small wording alternatives and artwork retouching come later.

| Order | Work | Result needed before moving on |
| --- | --- | --- |
| 1 | Define the offer, primary action and message hierarchy | One clear reason to respond; provisional headline and description |
| 2 | Refine D on desktop and compare mobile layouts | Approved structure, header and phone placement; workable long business names |
| 3 | Define recipient branding and shared section styling | Agreed rules for colors, logos, typography and fallbacks |
| 4 | Integrate section two, local proof and the response flow | One coherent page with a working next step |
| 5 | Lock image frames and produce the three Leroy directions | Desktop/mobile crops, real copier model and approved composition |
| 6 | Finish image details and copy variants | Name tag, natural expression, final button wording and spelling |
| 7 | Pilot the complete mail-to-page workflow | Correct QR destination, business identity, theme, form delivery and tracking |

Data preparation can run alongside design: collect verified business names, industries, official websites, logo candidates and color evidence now. The sequence above is the dependency order, not a requirement to postpone all independent work.

Section two can be designed now against the selected desktop direction and provisional shared styling. Its recommendation is to answer “What would actually improve in our office?” with three concrete, industry-specific benefits. For dental, start with insurance-card scanning, patient-document handling and dependable local service. This is a proposed content role, not an approved final section.

# Working decisions

- Desktop direction selected: option D, with wider live text on the left and Leroy and the copier on the right. This approves the text treatment, not every detail of D.

- Final artwork comes after desktop and mobile layout approval.

- Keep business names, slogans and buttons editable as page text.

- Website work stays in the existing GitHub and Vercel workflow.

- Open decisions: mobile layout, CTWP logo treatment, phone placement, supporting copy, color personalization and image crop. “Leroy stopped by” is rejected for the next revision.

# Compare small layout changes

The A–D comparison is live, with direct links to each option and Desktop/Mobile controls. Keep each future round focused on one question, using the same image and copy. The current Mobile control shows one existing layout; it does not represent three mobile design options.

Completed desktop comparison:

| Version | Change | Decision |
| --- | --- | --- |
| A | Current desktop hero | Baseline |
| B | Extend the hero to the top; place CTWP logo and phone over it | Header treatment |
| C | Same as B with a smaller headline | Headline size |
| D | Same as B with a different text-column width | Wrapping and balance |

Option D’s wider desktop text is selected. Carry it into the hero branch, then compare mobile structures and phone placement. Preserve A–D as the reference round instead of silently overwriting the comparison.

# Approve the responsive layout

Review the desktop winner at laptop and wide-screen widths, then settle the mobile layout. Check short and long business names, text contrast, logo visibility, button prominence and the space reserved for Leroy and the copier. Show screenshots at the same dimensions for fair comparisons; inspect each live version visually before delivery.

# Lock the image specification

Set the image frame before commissioning the final image. Record desktop and mobile hero proportions, image display area, crop behavior, subject position, clear space behind text and logo, and export dimensions. Define where Leroy’s face and the copier must remain visible as the screen changes size.

A responsive hero does not have one universal pixel size. Derive final export sizes from the approved layout. If a single image cannot crop cleanly for both desktop and mobile, specify separate compositions. Exact dimensions remain to be determined during layout review.

# Create the three image options

Use the approved frame and the same page copy for all three directions:

1. **Photorealistic visitor:** use real Leroy reference photos to create a believable ordinary-dog scene. This direction is still AI-assisted; the goal is natural appearance and recognizable identity.

2. **Believable character:** realistic Leroy with playful styling such as a dental coat or goggles, alongside a suitable real copier. The existing hero is the middle tier.

3. **Full comedy:** Leroy visibly performing a human role, such as playing the dentist, in a clearly fantastical scene.

Choose the scene and verify the copier model before generating final artwork. Judge the image inside the approved hero, then make only necessary crop and contrast adjustments.

# Review and approval record

For each round, record the variant links, the exact difference between versions, the preferred version and any requested adjustment. Preserve the chosen version so later comparisons remain clear. Present visual previews for review; code is not the review deliverable.

**Next design round:** build three mobile layout options using the existing artwork and provisional copy; carry D’s wider text forward on desktop. Compare the phone treatment separately. Refine the image only after the desktop and mobile frames are approved.

# Mobile layout round

The first comparison only changed desktop. Mobile needs its own design round using the same copy and temporary image.

| Option | Structure | Main tradeoff |
| --- | --- | --- |
| M1 recommended starting point | Compact logo, business/message/quote action, then a deliberate image area immediately below | Clear reading order; avoid the current large empty gap before Leroy |
| M2 | Compact image first, then business/message/quote action | Leroy establishes personality immediately, but the action appears farther down |
| M3 | Integrated portrait image with copy in a protected dark area | More immersive; requires stricter crop and contrast control |

Start with 360, 390 and 430 pixel phone widths, then check 320, tablet widths, landscape and enlarged text. Review actual screenshots and touch behavior, not only a scaled desktop view. Do not shrink the entire desktop hero to fit a phone or force a fixed screen-height hero that clips longer copy.

A separate image for every phone is unnecessary. Start with one desktop composition and one mobile crop per Leroy direction. Export appropriate resolutions of each. Add a separate mobile composition only when cropping cannot preserve Leroy’s face, the copier and clear text space. The browser can select image resolution and composition independently. Exact dimensions remain undecided until the frames are approved. [Responsive-image reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)

# Phone placement and hero copy

**Design recommendation, pending comparison:** remove the prominent phone pill from the desktop hero. Give the quote/review action primary emphasis. Keep a clear call option in the local-rep section and subsequent navigation. Compare this against a discreet text phone link in the upper-right; do not assume either treatment improves response rates without evidence.

On mobile, start with a compact labeled Call control in the header and one main quote action in the hero. A sticky call control is an option to test later if it does not cover content or compete with the primary action.

Remove “Leroy stopped by.” It also suggests a visit that may not have happened. A proposed replacement is “Prepared for University Dental Associates,” or omit the introductory line if the business name alone reads better.

Decide the message now; refine small wording later. Proposed supporting-copy direction: “Printing and scanning that fit your dental office, backed by local CTWP service.” This is draft language. Reserve space using realistic copy and short, medium and long business names. Do not use unverified savings claims or fabricate a personalized slogan.

# Business identity and brand inputs

Keep CTWP visibly identifiable as the sender. Recipient colors and an optional secondary logo signal that the proposal was prepared for that business. The prospect’s logo must not replace the CTWP mark.

Before building extraction, inspect existing campaign records for reusable logo and color data. Availability is not yet verified. Avoid collecting the same data twice.

For each business, retain:

- Stable business identifier, display name, industry, official website and intended landing-page slug.

- Logo asset and its source URL; match evidence connecting the logo to the correct business.

- Primary and optional secondary brand colors, original sampled values and approved display colors.

- Source, review date, confidence and whether the theme is approved, needs review or uses the fallback.

- Assigned hero layout, image tier, copy version, theme version, desktop/mobile crop and any manual override.

- Correct CTWP rep, phone number, service location and verified offer.

The bot proposes identity and colors; validation decides whether they are safe to apply. Use official brand guidance when available, then an official website logo. Do not automatically choose the largest pixel color: it may be white space, black text or a photo. Wrong, ambiguous, low-resolution or missing logos use the CTWP fallback. Missing recipient assets must not block the page from rendering.

# Color personalization rules

Implement the page shading, text and button colors as reusable page styles. Do not regenerate the hero photo simply to change its left-hand gradient. Keep Leroy, the copier and natural scene colors intact.

| Element | Rule |
| --- | --- |
| CTWP logo | Preserve its original colors and a readable surrounding area |
| Recipient logo | Optional, secondary and unaltered; use a neutral backing if needed |
| Left hero background | Deep, muted shade derived from the recipient primary color; blend toward transparency near the subject |
| Business name and main description | White or near-white on the dark hero; use brand-colored text only where contrast remains strong |
| Small emphasis and dividers | Recipient primary or secondary accent, used sparingly |
| Primary button | Approved recipient primary color with whichever light or dark label passes contrast; adjust the fill if necessary |
| Body section backgrounds | Consistent light neutral; small brand tints for selected accents |
| Fallback | Existing CTWP navy, red and cream |

| Recipient palette | Starting treatment |
| --- | --- |
| Blue, teal or green | Deep related shade on the left; recognizable primary-colored button |
| Red, orange or purple | Muted deep version on the left; stronger primary color reserved for the action |
| Yellow or very pale pastel | Dark neutral hero; pale brand color as an accent or button with a dark label |
| Black and white | Charcoal/neutral hero; a restrained CTWP red action |
| Multicolor | Choose one verified primary and at most one supporting accent |
| Unknown or uncertain | CTWP fallback until reviewed |

These are design rules to test, not a claim that every raw brand color will work. Proposed project target: at least 4.5:1 contrast for all interface text, including button labels, against its actual background. This exceeds the minimum for qualifying large text. Check gradients at the lightest area behind the letters, plus hover and focus states. If a color fails, adjust its lightness, choose another verified brand color or use the fallback; retain the original value in the record. [Contrast reference](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

Use a small pilot set spanning these palette families and short/long business names. Approve reusable themes before applying them across the prospect list. Save the selected theme values so repeated page visits do not produce different colors.

# Final artwork checklist

The three image directions describe degrees of realism, not whether AI is involved. All may be AI-assisted. Use recognizable real Leroy references throughout.

Choose and verify a copier CTWP actually offers and that fits the dental-office use case before final composition; changing its shape later can affect the layout. Use an accurate product reference and check model markings and proportions.

Finish after the frame is approved: add a readable Leroy name tag, test a warmer natural expression, clean up paws, clothing, reflections and product details, and verify desktop/mobile crops. A smile should still look like Leroy rather than an unnatural human expression. These remain proposed edits, not approved artwork.

# Parallel work and integration

Repository: `n14967744-dot/ctwpmail`. Dedicated hero branch: `design/hero-section`, created from main at `d39fe678f52e2c6f8fb9e5fb5f009ec842d09386`. The prior `design/hero-layout-review` branch contains the completed A–D reference round.

Hero work owns `app/hero-review/**`, future `components/hero/**`, `docs/hero/**` and separately named hero assets. The current production hero remains in `components/Landing.tsx`; integrate changes there only through coordinated review.

The section-two conversation should create `design/section-two` from current main, work in `components/sections/SectionTwo.tsx` with its own CSS module, `app/section-two-review/**` and `docs/section-two.md`. Both sections should consume agreed theme values. Do not independently rewrite shared global styles, the root layout, tracking, forms, existing landing pages or deployment settings.

Branches alone do not prevent conflicts. Keep files separate, avoid force pushes, and let one integrating conversation combine approved sections. Return a commit, visible preview and desktop/mobile screenshots. Preview sign-in is a deployment issue to report, not a reason to disable protection.

# Campaign assembly and pilot

Proposed workflow: verified prospect record → approved identity/colors → template and copy assignment → image/crop assignment → preview checks → published page → matching QR/mail piece → response and follow-up.

Before scaling, run the entire flow with a small approved pilot. Check the printed business name and QR against the destination, page loading on phones, correct rep/contact, form validation and delivery, analytics attribution and duplicate-event behavior. Keep demo reviews separate from real prospect-response counts. Use clearly labeled test records for submission tests.

Track approvals and version identifiers so a selected layout, image, copy and theme can be reproduced and rolled back. Test one substantive change at a time. Do not treat preview preferences as proven conversion gains.

# Section two handoff

Copy the handoff below into the new conversation. The working plan remains this Page; the hero branch includes `docs/section-two-handoff.md` for implementation continuity.

> Work on section two of the CTWP personalized mail-campaign landing page in GitHub repository n14967744-dot/ctwpmail. Read this plan and visually inspect https://ctwpmail.vercel.app/hero-review#d and the current University Dental page. The selected desktop hero uses D’s wider text; mobile hero is being developed separately on design/hero-section.
>
> Create design/section-two from current main. Own components/sections/SectionTwo.tsx and its CSS module, app/section-two-review/** and docs/section-two.md. Keep changes within section two. Coordinate shared theme requirements; do not independently edit the hero, globals, root layout, tracking, forms or deployment settings, and do not push main.
>
> Recommend what immediately follows the hero. Start with three concrete dental-office benefits answering “What would improve for our office?” Compare two focused layouts with realistic copy. Preserve clear CTWP identity and allow approved recipient-color accents. Do not invent savings, testimonials or product capabilities.
>
> Use GitHub and Vercel. Deliver clickable visual previews and desktop/mobile screenshots, inspect them yourself, and commit the work. If preview login blocks review, report it for the integrating conversation to resolve. The user reviews the rendered page, not code.
