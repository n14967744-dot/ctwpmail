/* Copy and sample data for the accounting design previews.
   The business below is a made-up sample. Real pages will read the business record. */

export const SAMPLE = {
  name: "Example Accounting Group",
  address: "3000 Briarcrest Dr, Bryan, TX 77802",
  distance: "About 2 miles from your office",
};

export const OFFICE = {
  address: "410 E. Villa Maria Rd, Bryan, TX 77801",
  mapsQuery: "410 E Villa Maria Rd, Bryan, TX 77801",
  hours: "Mon–Fri, 8am–5pm",
  phoneDisplay: "(979) 779-2998",
  phoneHref: "tel:+19797792998",
};

export const HERO = {
  headline: "Less time handling paperwork. More time serving clients.",
  lead: "From client document intake to finished reports, CTWP helps your office simplify printing and scanning, review printing costs, and get local support when equipment needs attention.",
  primary: "Start my quote",
  secondary: "Talk with our Bryan team",
};

export const HELP = {
  kicker: "For accounting offices",
  heading: "Make the paperwork part easier.",
  intro: "Client records, financial statements, tax returns—your equipment should help move the work along.",
  items: [
    {
      icon: "scan",
      title: "Get client documents into usable digital files.",
      body: "Turn stacks of receipts, statements and signed forms into searchable PDFs. We’ll help you choose scanning features and destinations that fit how your team organizes client files.",
    },
    {
      icon: "clock",
      title: "Keep deadline work moving.",
      body: "Print reports, copy supporting documents and prepare client packets with equipment suited to your workload—and local service when something needs attention.",
    },
    {
      icon: "chart",
      title: "Get a clearer picture of printing costs.",
      body: "Lease payments, toner, page charges and service all affect what you spend. We’ll help you compare the full picture and find a setup that fits your office.",
    },
  ],
} as const;

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
  timing: ["As soon as possible", "Before tax season", "In the next few months", "Just exploring"],
  lease: ["Within 6 months", "6 to 12 months", "More than a year", "No lease", "Not sure"],
  submit: "Request my quote",
  fine: "Our local team will review your needs and follow up to discuss options.",
};

export const VARIANTS = {
  a: { label: "A", name: "Editorial", note: "Calm and roomy. Serif headings on cream and navy." },
  b: { label: "B", name: "Bold", note: "Closest to ctwp.com. Squared headings, dark bands, big numbers." },
  c: { label: "C", name: "Local first", note: "Leads with the map and the team. Lighter and friendlier." },
} as const;

export type Variant = keyof typeof VARIANTS;
