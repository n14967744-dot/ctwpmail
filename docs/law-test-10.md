# Law campaign test group

The protected preview at `/law-test` loads ten existing law-firm research records from the private `law_preview_recipients` table using the existing server-side connection. No recipient fixture, business addresses, archive UUIDs, or archive dataset identifiers are committed on this branch.

Only the selected firm's public name, LAW reference, practice, office address, and website are sent to the protected page. Internal archive identifiers stay on the server. The CSV contains page and QR-arrival links, public business fields, and the original LAW reference. These are test candidates, not approved mailing recipients or confirmed customers. No master records are created or changed.

## Test flow

- Open a firm at `/law-test/[slug]` to try personalization, practice copy, and directions from its public office address to CTWP Bryan.
- `?src=qr` or `utm_medium=qr` identifies QR arrivals.
- `/api/law-test` resolves the slug from private storage and saves test-only visits or submissions in `law_preview_events`.
- Events retain their archive relationship privately. UUID event IDs make retries idempotent.
- RLS is enabled on both test tables. Anon/authenticated roles have no table access. Only the existing server role reads test records and inserts/selects test events. No API returns submitted contact details.
- Test routes skip production analytics, CRM changes, webhooks, and notification calls. Dental form behavior is preserved; generic law-review forms remain local previews.
- Use sample contact details. A saved receipt appears only after successful persistence.

This verifies personalization, maps, source matching, QR attribution, and intake persistence. It does not calculate prices, create proposals, approve mailings, or enable outreach. Keep Vercel preview protection enabled.
