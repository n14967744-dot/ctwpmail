# Current hero links

`/hero-review/mobile` always shows the mobile layout. On phones it fills the available width; on computers it remains phone-width. `/hero-review/desktop` always shows the 1440px desktop layout, scaled to fit on phones. No labels, controls, grey backgrounds or decorative borders. A borderless embedded viewport preserves each layout on either device.

Keep the existing image and hero design while refining this pair of links. Original complete landing page remains unchanged. User authorized publishing requested fixes.

## Branding round

Current draft removes “Leroy stopped by”, moves desktop copy upward, reduces heading to 64px, increases supporting copy to 24px and enlarges CTWP. Mobile removes the separate white navigation strip: CTWP and recipient logo share the top of the full-bleed hero. Existing Leroy image is retained. A discreet call link follows the primary action.

University Dental Associates logo verified in CTWPMAIL public logos bucket at university-dental-associates.jpg (1263×292). Sampled burgundy #920129 and charcoal #21201f; proposed deep hero background #29131c; white copy. These are draft colors sampled from the stored asset, not certified brand guidelines. Theme is saved in lib/hero-theme.ts; image and logo stay separate from text, button and gradient layers.

Pipeline: logo check → classify good/icon/missing → extract candidate colors from nontransparent, nonbackground pixels → visually review logo/palette → derive readable background/button/text combinations → store source, sampled palette, display palette, confidence/status and overrides by business → render both hero sizes → visual approval. Do not treat the largest pixel cluster as the brand color. Icon-only cases require review; missing cases use CTWP defaults. The reported 68/22/10 counts and pilot1.csv are user-supplied, not independently audited in this pass.

Database follow-up: review_requests currently has RLS disabled; this repository’s form writes to landing_requests. Audit other writers and implement tested access policies before using review_requests; no database permissions changed during this design pass.

Iteration: local hot reload and build checks can batch changes before one publication. A persistent remotely reachable live-edit preview is not configured yet; phone review links still require publication.
