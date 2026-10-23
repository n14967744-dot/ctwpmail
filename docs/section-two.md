# Section two: everyday dental-office benefits

Branch: `design/section-two`, based on current main `d39fe678f52e2c6f8fb9e5fb5f009ec842d09386`.

Visually inspected the live hero D comparison and University Dental page. This work adds only section-two files; it does not assemble or release the customer landing page.

## Recommendation

Immediately after the hero, explain three everyday improvements: simpler insurance-card scanning, less back-and-forth with patient paperwork, and a local team to contact when printing interrupts work. Use the existing cream, navy and red visual language, with an optional approved recipient accent.

Provisional headline: **Less printer friction. More room for patients.**

Recommend A for the first review. It lets readers compare all three benefits at a glance on desktop. On phones each benefit has its own card. B offers a more editorial desktop composition and an unboxed mobile list, but the icon column gives its copy less horizontal space. This is a design recommendation, not a proven conversion result.

| Layout | Desktop | Mobile |
| --- | --- | --- |
| A / columns | Shared heading above three equal columns | Three individual stacked cards |
| B / rows | Intro left, three divided rows right | Intro above a continuous list with icons at left |

Both use identical copy, order, colors and CTA. The component uses no new generated artwork. The small dark CTWP header in the preview is review context, not a proposed hero replacement.

## Review routes

- `/section-two-review#a-1200`: A desktop, 1200px viewport
- `/section-two-review#b-1200`: B desktop, 1200px viewport
- `/section-two-review#a-390`: A mobile, 390px viewport
- `/section-two-review#b-390`: B mobile, 390px viewport
- `/section-two-review/frame/a` and `/section-two-review/frame/b`: standalone responsive layouts

The review also offers 320, 360, 430, 768 and 1440px widths. These controls set the iframe's actual CSS viewport and then scale it to fit the review screen. The CTA links to a clearly labeled quote placeholder; it never submits a prospect inquiry.

## Integration contract

Import `SectionTwo` from `components/sections/SectionTwo.tsx` and place it after the approved hero. Use `layout="columns"` for A or `layout="rows"` for B. Default `quoteHref="#quote"` targets the existing form; default `id="office-benefits"` can be overridden. Only render one selected instance on the customer page, or give instances distinct IDs.

All section styles live in `SectionTwo.module.css`. Fonts consume the existing `--sans` and `--serif` values. Proposed shared theme inputs are `--campaign-accent`, `--campaign-tint`, `--campaign-action` and `--campaign-action-text`; these are consumed with CTWP fallback values, never defined globally here. An optional `theme` prop can set equivalent section-local `accent`, `tint`, `action` and `actionText` display values. Coordinate these names with the hero owner before integration.

Only pass approved display colors, never raw sampled logo colors. Accent text and button labels must reach the plan's 4.5:1 target on their actual backgrounds. Keep body text and background neutral. CTWP identity remains unchanged; this review does not claim any colors belong to University Dental.

## Claims and remaining decisions

Copy describes a review and recommended setup, without promising one-pass card scanning, automatic filing, OCR, EHR integration, privacy compliance, savings percentages, service prices or response times. Local Bryan positioning follows the existing project and campaign brief. Confirm offered equipment, workflow compatibility and service terms before final publication.

The integrating conversation owns the final hero-to-section transition, the action wording, and the form. Final hero copy/artwork and mobile hero selection remain on `design/hero-section`.

The existing root instrumentation runs on review routes too. No tracking code is changed here. Treat `section-two-review` as a design-review slug and exclude it from campaign response reporting; coordinate a central review-route exclusion before wider review. There are no real form submissions in these previews.

## Validation

- `npm run build`: passed, including TypeScript and both statically generated variant routes.
- Browser checks and screenshot evidence: to be recorded after visual QA.
- Production, hero, shared CSS, root layout, forms, tracking and deployment settings remain unchanged.
