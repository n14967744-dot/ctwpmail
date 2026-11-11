# Accounting opening concept

Route: `/accounting-opening` · branch: `design/accounting-opening-v1`.

Visual thesis: warm natural photography, clear blue CTWP sender identity and spacious editorial typography, personalized for Seidel Schroeder.

Content plan: header with local contact, one full-bleed personalized hero, and one practical workflow section with three expandable benefits. This deliberately covers only the opening requested for review.

Interaction thesis: staggered hero entrance, gentle section reveal on scroll, clear hover/focus transitions and accessible benefit accordions. Reduced motion is respected. The CTA opens a small demonstrable needs-selection flow; it does not submit leads or contact anyone.

This is an isolated design route. Existing dentist and lawyer routes are unchanged. No database connection, customer data export, tracking calls, DNS edits or production-domain changes are introduced. The static sample uses only Seidel Schroeder's business name and reviewed public logo.

Assets: original Leroy photographs from CTWPMAIL hq-assets/leroy-real were supplied to image generation for the new image-only office scene. Source photo generated 2026-11-11. Logo: official CTWP website header treatment. Recipient logo source: https://www.ssccpa.com/hs-fs/hubfs/FINAL_LOGO_SEIDEL_SCHROEDER_color-2.png . Local phone confirmed on https://www.ctwp.com/ .

Future implementation: resolve the approved business by slug from CTWPMAIL `ctwp_campaign.businesses` server-side and select only permitted display fields; use `niche` and `business_subgroup` for copy. This route contains no public database credentials and makes no instant-price claims. A production request flow requires the separately scoped submission implementation.

## Hero revision 2 — 2026-11-11

Visual thesis: a centered, navy CTWP welcome with the recipient name as the headline, a natural full-body Leroy in his blue bandana, and one clear red quote button below the scene. The user’s IMG_0093 reference guides hierarchy and color; the source Leroy photos guide identity.

Content plan: compact CTWP logo and local phone, Prepared for + firm name, two-line paperwork/client-time promise, dog and commercial copier, quote action. The second section and quote dialog are retained for the next review.

Interaction thesis: retain staggered text entrance, gentle image arrival, scroll reveals, button feedback and the existing preview quote flow. Respect reduced motion.

New asset: `public/accounting-opening/leroy-office-v2.webp`, generated from the two real Leroy photos and the user's composition reference. Scene prompt: natural small Leroy, blue bandana, all four paws on a blue rug; prominent correctly scaled charcoal copier; walnut accounting office and deep navy wall; no text/UI. Built-in image generation was used.
