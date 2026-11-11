/* Copy for the mail campaign landing page.
   SHARED sections are the same for every business.
   NICHES holds what changes by kind of business: picture, headline, the three benefits and the timing question.
   status "approved" = wording supplied by Nick. status "draft" = placeholder wording that still needs review. */

export const OFFICE = {
  address: "410 E. Villa Maria Rd, Bryan, TX 77801",
  mapsQuery: "410 E Villa Maria Rd, Bryan, TX 77801",
  hours: "Mon–Fri, 8am–5pm",
  phoneDisplay: "(979) 779-2998",
  phoneHref: "tel:+19797792998",
};

export const HERO = {
  eyebrow: "Prepared for",
};

export const ABOUT = {
  kicker: "Your local copier company",
  heading: "In Bryan since 1979.",
  body: "CTWP opened on January 8, 1979, and the Bryan branch opened later that same year. Today CTWP is one of the largest independently operated copier dealers in Texas, with seven locations and a team based right here in Bryan–College Station.",
  motto: "CTWP believes in “Customers for Life.”",
  stats: [
    { value: "45+", label: "Years of service" },
    { value: "7", label: "Texas locations" },
    { value: "1979", label: "Bryan office opened" },
    { value: "24 hrs", label: "Free quote turnaround" },
  ],
};

export const BADGES = [
  { src: "/preview/badges/enx-elite-dealer-2025.jpg", alt: "ENX Magazine Elite Dealer 2025", caption: "ENX Magazine Elite Dealer" },
  { src: "/preview/badges/km-pro-tech-2025.jpg", alt: "Konica Minolta Pro-Tech Service Center 2025, Service Excellence", caption: "Konica Minolta Pro-Tech Service Award" },
  { src: "/preview/brands/xerox.png", alt: "Xerox Platinum Authorized Dealer", caption: "Xerox Platinum Authorized Dealer" },
  { src: "/preview/badges/bta-navy.png", alt: "A long time member of the Business Technology Association", caption: "Business Technology Association member" },
];

export const TECHS = {
  kicker: "Service",
  heading: "Technicians who know your machine.",
  points: [
    "Factory-trained and certified by Kyocera, Lexmark, Xerox, Canon and Konica Minolta.",
    "Many have over 20 years of experience with CTWP alone.",
    "New equipment is tested before it arrives at your office.",
    "Your staff is trained on it at installation.",
  ],
};

export const ORGS = [
  { src: "/preview/customers/tamu.png", name: "Texas A&M departments", wide: true },
  { src: "/preview/customers/bryan-isd.png", name: "Bryan ISD" },
  { src: "/preview/customers/college-station.png", name: "City of College Station" },
  { src: "/preview/customers/bcs-chamber.png", name: "B-CS Chamber of Commerce" },
];

export const BRANDS = [
  { src: "/preview/brands/kyocera.jpg", name: "Kyocera" },
  { src: "/preview/brands/canon.jpg", name: "Canon" },
  { src: "/preview/brands/konica-minolta.png", name: "Konica Minolta" },
  { src: "/preview/brands/xerox.png", name: "Xerox" },
  { src: "/preview/brands/lexmark.jpg", name: "Lexmark" },
  { src: "/preview/brands/kip.png", name: "KIP" },
  { src: "/preview/brands/brother.jpg", name: "Brother" },
  { src: "/preview/brands/fp.jpg", name: "FP" },
];

export const LOCAL = {
  kicker: "Right here in Bryan",
  heading: "Local support for the work you do every day.",
  body: "Your CTWP team is here in Bryan–College Station to help with equipment options, setup and ongoing service. Tell us what’s working, what’s slowing you down and what you’d like to improve.",
  quote: "We have been renting copiers from CTWP for at least 6 years, and are very happy with their services. In our experience, we have found that their service agreements are very reasonably priced, and they are prompt and professional when we need to call for supplies or service.",
  quoteBy: "Amy A., Bryan service customer",
  callout: {
    title: "Happy with your current copier?",
    body: "Tell us the make and model. We can check whether service and support are available for your equipment.",
    button: "Ask about service",
  },
};

export const LEROY = {
  heading: "Meet Leroy.",
  body: "Leroy is a Dachshund/Yorkie mix rescued by CTWP’s owner, David Willie, in 2014. He spends his days visiting CTWP’s seven offices, and he’s the one who brought you our mail.",
};

export const FORM = {
  kicker: "Free quote within 24 hours",
  intro: "Tell us what you’d like to improve. You don’t need model numbers or exact print volumes to get started.",
  help: [
    "Replacing or adding equipment",
    "Reviewing printing costs",
    "Improving scanning and document handling",
    "Service for existing equipment",
    "Not sure—help me figure it out",
  ],
  lease: ["Within 6 months", "6 to 12 months", "More than a year", "No lease", "Not sure"],
  submit: "Request my quote",
  fine: "Our local team will review your needs and follow up to discuss options.",
};

const TIMING = ["As soon as possible", "In the next few months", "When our lease is up", "Just exploring"];

/* ---------- what changes by niche ---------- */

export type IconName = "scan" | "clock" | "chart" | "lock" | "packet" | "color" | "plans";

export type NicheContent = {
  status: "approved" | "draft";
  label: string;
  kicker: string;
  /** How we refer to their place of work: "your office", "your firm", "your practice". */
  place: string;
  emailHint: string;
  hero: { headline: string; lead: string; image: string; imageAlt: string };
  help: { heading: string; intro: string; items: { icon: IconName; title: string; body: string }[] };
  timing: string[];
};

const OFFICE_IMAGE = { image: "/preview/leroy-office.webp", imageAlt: "Leroy, CTWP’s office dog, standing beside a copier in an office" };
const COSTS_ITEM = {
  icon: "chart" as const,
  title: "Get a clearer picture of printing costs.",
  body: "Lease payments, toner, page charges and service all affect what you spend. We’ll help you compare the full picture and find a setup that fits your office.",
};

const accounting: NicheContent = {
  status: "approved",
  label: "Accounting",
  kicker: "For accounting offices",
  place: "office",
  emailHint: "you@yourfirm.com",
  hero: {
    headline: "Less time handling paperwork. More time serving clients.",
    lead: "From client document intake to finished reports, CTWP helps your office simplify printing and scanning, review printing costs, and get local support when equipment needs attention.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Make the paperwork part easier.",
    intro: "Client records, financial statements, tax returns—your equipment should help move the work along.",
    items: [
      { icon: "scan", title: "Get client documents into usable digital files.", body: "Turn stacks of receipts, statements and signed forms into searchable PDFs. We’ll help you choose scanning features and destinations that fit how your team organizes client files." },
      { icon: "clock", title: "Keep deadline work moving.", body: "Print reports, copy supporting documents and prepare client packets with equipment suited to your workload—and local service when something needs attention." },
      COSTS_ITEM,
    ],
  },
  timing: ["As soon as possible", "Before tax season", "In the next few months", "Just exploring"],
};

const tax: NicheContent = {
  ...accounting,
  label: "Tax preparation",
  kicker: "For tax preparation offices",
  hero: {
    headline: "Keep client paperwork moving through tax season.",
    lead: "From incoming tax documents to completed return packets, CTWP helps your office handle busy-season printing and scanning with equipment that fits your workload and local support.",
    ...OFFICE_IMAGE,
  },
  help: {
    ...accounting.help,
    items: [
      { icon: "scan", title: "Make tax document intake easier.", body: "Scan W-2s, 1099s, receipts and supporting records into searchable PDFs, with scanning options that fit how your office organizes each client’s documents." },
      { icon: "clock", title: "Be ready for the busiest weeks.", body: "Prepare client copies, scan signed forms and handle deadline-day volume with equipment chosen for your seasonal workload." },
      COSTS_ITEM,
    ],
  },
};

/* Benefit wording is taken from the existing lawyer page (general practice). Headline and lead are placeholders. */
const legal: NicheContent = {
  status: "draft",
  label: "Law firms",
  kicker: "For law firms",
  place: "firm",
  emailHint: "you@yourfirm.com",
  hero: {
    headline: "Less time on the paperwork. More time on the case.",
    lead: "CTWP is offering your firm a personalized review to explore lower printing costs, easier scanning, and stronger document security—with equipment options or local service for your current copier.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Built around how a firm handles paper.",
    intro: "Client packets, correspondence, and documents that need to become usable files.",
    items: [
      { icon: "packet", title: "The meeting’s at two. The packet isn’t ready.", body: "Sorting, flipping, and stapling can turn a print job into a project. Let’s look at a setup that handles more of that preparation for your team." },
      { icon: "scan", title: "You scanned it. Now, where did it go?", body: "A scan is only useful if someone can find it. We’ll walk through how paper becomes a named, searchable file—and what your existing software needs to make that work." },
      { icon: "lock", title: "Client documents. Not communal reading.", body: "Sensitive pages can end up waiting in a shared output tray. We’ll review print-release and user-access options so your team can collect documents more deliberately." },
    ],
  },
  timing: TIMING,
};

/* Benefit wording is taken from the existing dentist page. Headline and lead are placeholders. */
const dentists: NicheContent = {
  status: "draft",
  label: "Dental practices",
  kicker: "For dental practices",
  place: "practice",
  emailHint: "you@yourpractice.com",
  hero: {
    headline: "Less time at the copier. More time with patients.",
    lead: "From insurance cards to patient packets, CTWP helps your front desk print and scan with less effort, review printing costs, and get local support when equipment needs attention.",
    image: "/dental/hero.jpg",
    imageAlt: "Leroy, CTWP’s office dog, in a white coat beside a copier in a dental office",
  },
  help: {
    heading: "Set up around how your front desk works.",
    intro: "Check-in, charts and patient paperwork—your equipment should keep the day moving.",
    items: [
      { icon: "scan", title: "Insurance cards, front and back, in one scan.", body: "Lay the card on the glass and get both sides on a single page, ready for the chart. Every card copy comes out clean and readable." },
      { icon: "lock", title: "Patient privacy built into every print job.", body: "Sensitive documents can stay in the queue until someone signs in at the machine to release them, so charts and statements don’t sit in the tray." },
      { icon: "packet", title: "Patient packets ready at the front desk.", body: "Print intake forms two-sided, collated and stapled right next to the check-in window." },
    ],
  },
  timing: TIMING,
};

const healthcare: NicheContent = {
  status: "draft",
  label: "Healthcare practices",
  kicker: "For medical practices and clinics",
  place: "practice",
  emailHint: "you@yourpractice.com",
  hero: {
    headline: "Less time on paperwork. More time with patients.",
    lead: "From intake forms to records requests, CTWP helps your practice simplify printing and scanning, review printing costs, and get local support when equipment needs attention.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Keep the front desk moving.",
    intro: "Intake forms, referrals and records—your equipment should help the paperwork keep up with the schedule.",
    items: [
      { icon: "scan", title: "Turn paper forms into files your staff can find.", body: "Scan intake forms, referrals and signed consents into searchable PDFs. We’ll review scanning options with you and confirm what works with the software your practice already uses." },
      { icon: "lock", title: "Keep patient paperwork with the right person.", body: "Printed pages can wait in a shared tray. We’ll review print-release and user-access options so staff collect documents deliberately." },
      COSTS_ITEM,
    ],
  },
  timing: TIMING,
};

const churches: NicheContent = {
  status: "draft",
  label: "Churches",
  kicker: "For churches and ministries",
  place: "church office",
  emailHint: "you@yourchurch.org",
  hero: {
    headline: "Bulletins, programs and newsletters, ready before Sunday.",
    lead: "From weekly bulletins to event flyers, CTWP helps your church office print what it needs, keep costs predictable, and get local support when equipment needs attention.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Printing that fits the church week.",
    intro: "Bulletins, programs, sign-up sheets and mailers—your equipment should make the weekly routine easier.",
    items: [
      { icon: "packet", title: "Bulletins folded and finished, not assembled by hand.", body: "We’ll look at folding, stapling and booklet options around what your office prints each week, so volunteers spend less time at the table." },
      { icon: "color", title: "Color where it counts.", body: "Use color for the pieces people keep, and black and white for everyday copies. We’ll help you see what each costs." },
      { ...COSTS_ITEM, title: "Costs that fit a church budget.", body: "Lease payments, toner, page charges and service all affect what you spend. We’ll help you compare the full picture and find a setup your budget can count on." },
    ],
  },
  timing: TIMING,
};

const construction: NicheContent = {
  status: "draft",
  label: "Construction, architecture and engineering",
  kicker: "For builders, architects and engineers",
  place: "office",
  emailHint: "you@yourcompany.com",
  hero: {
    headline: "Plans, bids and change orders, printed when the job needs them.",
    lead: "From bid packets to signed change orders, CTWP helps your office print and scan project paperwork, review printing costs, and get local support when equipment needs attention.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Paperwork that keeps up with the project.",
    intro: "Drawings, submittals, bids and contracts—your equipment should be ready when the schedule changes.",
    items: [
      { icon: "plans", title: "Plans and drawings at the size you need.", body: "If you print or copy large sheets, ask us about wide-format options. We’ll confirm what fits the sizes and volumes your office actually handles." },
      { icon: "packet", title: "Bid packets and submittals without the scramble.", body: "Print, collate and staple complete sets with equipment suited to your workload—and local service when something needs attention." },
      { icon: "scan", title: "Signed paperwork into the project file.", body: "Scan contracts, change orders and field paperwork into searchable PDFs, with destinations that fit how your team organizes each job." },
    ],
  },
  timing: ["As soon as possible", "Before our next project", "In the next few months", "Just exploring"],
};

const general: NicheContent = {
  ...accounting,
  status: "draft",
  label: "General office",
  kicker: "For local offices",
  hero: {
    headline: "Less time at the copier. More time on your work.",
    lead: "CTWP helps your office simplify printing and scanning, review printing costs, and get local support when equipment needs attention.",
    ...OFFICE_IMAGE,
  },
  help: {
    heading: "Make the paperwork part easier.",
    intro: "Your equipment should help move the work along.",
    items: [
      { icon: "scan", title: "Get paper into usable digital files.", body: "Turn stacks of paper into searchable PDFs. We’ll help you choose scanning features and destinations that fit how your team works." },
      { icon: "clock", title: "Keep everyday work moving.", body: "Print, copy and prepare packets with equipment suited to your workload—and local service when something needs attention." },
      COSTS_ITEM,
    ],
  },
  timing: TIMING,
};

export const NICHES = { accounting, tax, legal, dentists, healthcare, churches, construction, general } as const;
export type NicheKey = keyof typeof NICHES;

/** Picks the copy for a business from its niche and subgroup as stored in the business record. */
export function nicheKeyFor(niche: string | null | undefined, subgroup?: string | null): NicheKey {
  const n = (niche ?? "").toLowerCase();
  const sub = (subgroup ?? "").toLowerCase();
  if (n === "accounting_tax" || n === "accounting" || n === "tax") return n === "tax" || sub.startsWith("tax") ? "tax" : "accounting";
  if (n === "legal" || n === "law") return "legal";
  if (n === "dentists" || n === "dental") return "dentists";
  if (n === "healthcare") return "healthcare";
  if (n === "churches") return "churches";
  if (n === "construction") return "construction";
  return "general";
}
