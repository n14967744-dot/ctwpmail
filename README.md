# CTWP landing pages — site directory

Last verified: October 29, 2026.

## Which site is which?

| Site | GitHub branch | Vercel project | Link |
| --- | --- | --- | --- |
| Lawyers / law firms | `feature/law-test-private` | `ctwpmail` (preview) | [Banks & Banks lawyer example](https://ctwp-lawyers.vercel.app/banks-banks-attorneys-at-law-p-c-law-006#needs-title) |
| Dentists / existing production site | `main` | `ctwpmail` (production) | [Dentist site](https://ctwpmail.vercel.app) |
| Image library | Separate project; branch not verified here | `ctwp-image-library` | [Image library](https://ctwp-image-library.vercel.app) |

**The root ctwpmail.vercel.app URL is the dentist version. Do not identify it as the lawyer landing page.** Both campaigns currently share this repository and Vercel project but use different branches/deployments.

## Confirmed lawyer reference

The user confirmed this exact page on October 29, 2026:
https://ctwpmail-c77xy5s36-n14967744-2024.vercel.app/banks-banks-attorneys-at-law-p-c-law-006#needs-title

- Firm: Banks & Banks, Attorneys at Law, P.C.
- Source branch: `feature/law-test-private`
- Reference commit: `c74b067bc5bb187d84f3ce546228dc7d1aa305b4`
- Reference deployment: `dpl_EnBV7Ws8tFyJM5DLF1dKqdBYj8Wo`
- Named alias: `ctwp-lawyers.vercel.app` points to that reference deployment.
- Automatic branch alias: `ctwpmail-git-feature-law-test-private-n14967744-2024.vercel.app` follows successful deployments from the lawyer branch.
- The personalized path is required. Do not assume the root of the lawyer alias is a lawyer page.
- `#needs-title` scrolls to a section; omit it to open at the top.
- The named alias is pinned manually, not an automatic branch tracking alias. After an approved lawyer release, verify the personalized page and reassign the named alias to the intended READY deployment.
- This is a preview with existing Vercel access protection. The named alias may require Vercel sign-in; it is not established as a public mail campaign URL. Access settings were not changed.

## Working on these sites

1. For lawyer changes, start from `feature/law-test-private` and verify the personalized lawyer page above.
2. For dentist changes, start from `main`. Its production alias was mapped to deployment `dpl_3F35trrwSdqAnZ7ciSaxgpxv6Vj7`, source commit `126ec2006367c02c6af73f23b0d1cb93d7401aff`, when this directory was created.
3. Do not merge the lawyer branch into main or repoint production as a shortcut for locating the lawyer page.
4. Check live Vercel deployment metadata before calling any URL “latest.” A per-deployment URL stays tied to that build.
5. Keep this directory consistent on both branches when the campaign mapping changes.
6. Check access without an authenticated session before putting any URL in printed QR codes or mailouts.

Vercel team: `team_6Jvt5GK2EKBVZiSUz4RMiasL`
Vercel project: `prj_0eJ5uluwER6xON3ejdqwdLVx8rdm`
Repository: https://github.com/n14967744-dot/ctwpmail
