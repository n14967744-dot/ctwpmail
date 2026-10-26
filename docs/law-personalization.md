# Law recipient previews

`/law-review/[slug]` resolves a record from `app/law-review/recipients.json`.
The snapshot contains the 67 Candidate records from the cleaned first-pass list.
These are design candidates, not approved mailing recipients. Neon project
`bcs-business-lists` was checked; this route does not query it at runtime.

Slugs include the stable LAW source ID to avoid collisions. Preserve published
slugs when display names change. Do not regenerate them for existing campaigns.
Only name, source ID, slug and approved copy-module key are published; research,
customer flags and contact details are excluded. Unknown slugs return not-found.

Name personalizes the hero and prefills the form. Practice selects the existing
workflow copy. No user-facing template selector is added. Forms remain preview-only.
Keep CTWP branding and existing artwork for this first pass. Future live sync
should map the source ID to Neon business ID and retain these permanent slugs.
