/* Copy for the accounting and tax preparation landing page, as supplied by Nick on Nov 11, 2026.
   Same layout for both; tax preparation offices get the substitutions in TAX. */

export type AccountingCopy = {
  hero: { headline: string; lead: string; primary: string; secondary: string };
  help: {
    kicker: string; heading: string; intro: string;
    /* label: small line above the title. button: opens the quote pop-up with `choice` already picked (must match a form.help option). */
    items: { image: string; alt: string; label: string; title: string; body: string; button: string; choice: string }[];
  };
  local: { kicker: string; heading: string; body: string; visit: string; calloutTag: string; calloutTitle: string; calloutBody: string; calloutButton: string };
  form: { heading: string; intro: string; helpQuestion: string; help: string[]; timingQuestion: string; timing: string[]; submit: string; fine: string; thanksHeading: string; thanksBody: string; contactQuestion: string; cta: string;
    /* The optional copier-details step offered after the request is sent. */
    detailsLabel: string; detailsInvite: string; detailsButton: string; detailsHeading: string; detailsHint: string;
    detailsSubmit: string; detailsThanksHeading: string; detailsThanksBody: string;
  };
};

export const SERVICE_OPTION = "Service for existing equipment";
const EQUIPMENT_OPTION = "Replacing or adding equipment";
const COSTS_OPTION = "Reviewing printing costs";
const SCANNING_OPTION = "Improving scanning and document handling";

/* Photos for the three benefits (4:3, 1448 x 1086), in public/accounting/help/. */
const PHOTO = {
  scan: { image: "/accounting/help/scanning.webp", alt: "Client documents being loaded into a copier’s document feeder" },
  packet: { image: "/accounting/help/packets.webp", alt: "Finished report packets being organized beside an office copier" },
  costs: { image: "/accounting/help/costs.webp", alt: "Two people comparing copier and service estimates with a calculator" },
};

export const ACCOUNTING: AccountingCopy = {
  hero: {
    headline: "Less time handling paperwork. More time serving clients.",
    lead: "From client document intake to finished reports, CTWP helps your office simplify printing and scanning, review printing costs, and get local support when equipment needs attention.",
    primary: "Start my quote",
    secondary: "Talk with our Bryan team",
  },
  help: {
    kicker: "For accounting offices",
    heading: "Make the paperwork part easier.",
    intro: "Client records, financial statements, tax returns—your equipment should help move the work along.",
    items: [
      {
        ...PHOTO.scan,
        label: "Document scanning",
        button: "Talk about scanning",
        choice: SCANNING_OPTION,
        title: "Get client documents into usable digital files.",
        body: "Turn stacks of receipts, statements and signed forms into searchable PDFs. We’ll help you choose scanning features and destinations that fit how your team organizes client files.",
      },
      {
        ...PHOTO.packet,
        label: "Client packets",
        button: "Talk about equipment",
        choice: EQUIPMENT_OPTION,
        title: "Keep deadline work moving.",
        body: "Print reports, copy supporting documents and prepare client packets with equipment suited to your workload—and local service when something needs attention.",
      },
      {
        ...PHOTO.costs,
        label: "Printing costs",
        button: "Talk about printing costs",
        choice: COSTS_OPTION,
        title: "Get a clearer picture of printing costs.",
        body: "Lease payments, toner, page charges and service all affect what you spend. We’ll help you compare the full picture and find a setup that fits your office.",
      },
    ],
  },
  local: {
    kicker: "",
    heading: "Your local copier company.",
    body: "Our sales and service teams work from our office on East Villa Maria Road in Bryan. You are always welcome to visit.",
    visit: "",
    calloutTag: "",
    calloutTitle: "Already have a copier?",
    calloutBody: "",
    calloutButton: "Ask us about service.",
  },
  form: {
    /* {business} is replaced with the business name. */
    heading: "Let’s find the right fit for {business}.",
    intro: "Tell us what you’d like to improve. You don’t need model numbers or exact print volumes to get started.",
    helpQuestion: "What would you like help with?",
    help: [
      EQUIPMENT_OPTION,
      COSTS_OPTION,
      SCANNING_OPTION,
      SERVICE_OPTION,
      "Not sure—help me figure it out",
    ],
    timingQuestion: "When would you like to make a change?",
    timing: ["As soon as possible", "Before tax season", "After tax season", "Just exploring"],
    submit: "Request my quote",
    fine: "Our local team will review your needs and follow up to discuss options.",
    thanksHeading: "Thank you. We have your request.",
    thanksBody: "Someone from our Bryan office will be in touch to talk through your options.",
    contactQuestion: "Where should we reach you?",
    cta: "Start my quote",
    detailsLabel: "For a more accurate quote",
    detailsInvite: "Tell us about your current copier. A photo of its label, with the serial number showing, is the quickest way.",
    detailsButton: "Add copier details",
    detailsHeading: "About your current copier",
    detailsHint: "All of this is optional. Share whatever you have.",
    detailsSubmit: "Send details",
    detailsThanksHeading: "Thank you. That helps.",
    detailsThanksBody: "We’ll use it to prepare your quote.",
  },
};

export const TAX: AccountingCopy = {
  ...ACCOUNTING,
  hero: {
    ...ACCOUNTING.hero,
    headline: "Keep client paperwork moving through tax season.",
    lead: "From incoming tax documents to completed return packets, CTWP helps your office handle busy-season printing and scanning with equipment that fits your workload and local support.",
  },
  help: {
    ...ACCOUNTING.help,
    kicker: "For tax preparation offices",
    items: [
      {
        ...PHOTO.scan,
        label: "Document intake",
        button: "Talk about scanning",
        choice: SCANNING_OPTION,
        title: "Make tax document intake easier.",
        body: "Scan W-2s, 1099s, receipts and supporting records into searchable PDFs, with scanning options that fit how your office organizes each client’s documents.",
      },
      {
        ...PHOTO.packet,
        label: "Tax season",
        button: "Talk about equipment",
        choice: EQUIPMENT_OPTION,
        title: "Be ready for the busiest weeks.",
        body: "Prepare client copies, scan signed forms and handle deadline-day volume with equipment chosen for your seasonal workload.",
      },
      ACCOUNTING.help.items[2],
    ],
  },
};

/* About CTWP and customers: the same for accounting and tax. Facts are from ctwp.com. */
export const ABOUT = {
  kicker: "About CTWP",
  heading: "Serving Bryan–College Station since 1979.",
  body: "We sell, lease and service copiers and printers, with our own technicians based right here in town.",
  badgesLabel: "Recognized for service",
  badges: [
    { src: "/accounting/badges/enx-elite-dealer-2025.jpg", alt: "ENX Magazine Elite Dealer 2025" },
    { src: "/accounting/badges/km-pro-tech-2025.jpg", alt: "Konica Minolta Pro-Tech Service Center 2025" },
    { src: "/accounting/badges/xerox-platinum.png", alt: "Xerox Platinum Authorized Dealer" },
    { src: "/accounting/badges/bta-navy.png", alt: "A long time member of the Business Technology Association" },
  ],
};

export const CUSTOMERS = {
  line: "We believe in Customers for Life.",
  logos: [
    { src: "/accounting/customers/tamu.png", name: "Texas A&M University" },
    { src: "/accounting/customers/bryan-isd.png", name: "Bryan ISD" },
    { src: "/accounting/customers/college-station.png", name: "City of College Station" },
    { src: "/accounting/customers/bcs-chamber.png", name: "B/CS Chamber of Commerce" },
  ],
};

/** Wording for a segment inside the accounting niche. Add a segment here when one needs its own copy. */
export function accountingCopy(segment?: string | null): AccountingCopy {
  return segment?.trim().toLowerCase() === "tax prep" ? TAX : ACCOUNTING;
}
