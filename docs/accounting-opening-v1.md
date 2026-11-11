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

## Second-section imagery — 2026-11-11

Approved hero is preserved. The workflow section now pairs its three benefits with distinct original editorial images: loading documents into an ADF, preparing finished client packets, and comparing copier/service costs. On desktop the large photograph crossfades with the selected accordion; on mobile each open benefit contains its own image. No automatic carousel, new dependency, tracking or submission behavior is introduced. The quote interaction remains the preview flow.

Visual thesis: tactile office work in warm walnut, navy and natural daylight. Content plan: a short shared heading followed by one focused workflow image and its matching explanation. Interaction thesis: retained scroll reveals and accordions, plus a restrained image crossfade with reduced-motion support.

Generated assets: `workflow-scanning.webp`, `workflow-packets.webp`, `workflow-costs.webp` under `public/accounting-opening/`. Built-in image generation produced illustrative work scenes; these do not depict identified CTWP staff or real client records. Prompts specified warm editorial photography, natural hands, charcoal copiers, no readable client data, no pricing or claims, and crop-safe central subjects.

## Second-section style alignment — 2026-11-11

The user approved the hero and asked for a more consistent second-section style. The benefits section now uses the same Outfit 600 heading weight, -0.04em headline tracking, centered hierarchy, navy typography and red rounded action treatment as the hero. The former gray-green emphasis, numbering, small repeated subtitles and tiny image/capability captions are removed. Body copy is larger, imagery has softened corners, and the section uses a clean white background. The approved header/hero markup, hero CSS, generated images, animations and quote behavior are preserved.
