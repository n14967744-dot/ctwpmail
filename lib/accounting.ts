/* Copy for the accounting and tax preparation landing page ("focus" version, Nov 12, 2026).
   One layout, two wording sets: ACCOUNTING for accounting offices, TAX for tax preparation offices.
   TAX leads with the season everywhere; it is not a find-and-replace of ACCOUNTING.

   The one action is called "Get my quote" everywhere (page buttons, bottom bar, the pop-up's send button). */

/** One benefit line: a short title and one sentence. `icon` picks the small drawing beside it. */
type Benefit = { icon: "stack" | "lock" | "cost" | "season"; title: string; body: string };

export type AccountingCopy = {
  hero: {
    /** One or two sentences under Leroy: what this is and why CTWP. */
    statement: string;
    /** Under the hero button. */
    fine: string;
  };
  /** Second screen: the quote's first question, as large rows. Each row is also an option in the pop-up. */
  /* `lead` comes first (who CTWP is, since when); the heading is the question, framed by the season (Nick, Nov 12). */
  ask: { lead: string; heading: string; intro: string };
  benefits: { heading: string; items: Benefit[] };
  /** The true reason to act now, then the final ask. */
  timing: { heading: string; body: string };
  form: {
    helpQuestion: string;
    help: string[];
    timingQuestion: string;
    timing: string[];
    contactQuestion: string;
    submit: string;
    fine: string;
    thanksHeading: string;
    thanksBody: string;
    /* The optional copier-details step offered after the request is sent. */
    detailsInvite: string; detailsButton: string; detailsHeading: string; detailsHint: string;
    detailsSubmit: string; detailsThanksHeading: string; detailsThanksBody: string;
  };
};

/** The one name for the action, on every button that opens the pop-up. */
export const ACTION = "Get my quote";
/** What those buttons say once a request has been sent from this visit. */
export const ACTION_DONE = "Quote requested";

/* Stated by Nick (Nov 12): CTWP has served accounting and tax offices in Texas since 1979. */
const SINCE_1979 = "CTWP has served accounting and tax offices in Texas since 1979.";

const SERVICE_OPTION = "My copier needs service";
const COSTS_OPTION = "I want to check what I’m paying";
const NOT_SURE_OPTION = "Not sure yet";

const FORM_COMMON = {
  helpQuestion: "What would you like help with?",
  timingQuestion: "When do you need this done?",
  contactQuestion: "Who should we call?",
  submit: ACTION,
  fine: "Someone from our Bryan office will call or email you about your quote.",
  thanksHeading: "Thank you. We have your quote request.",
  thanksBody: "Someone from our Bryan office will be in touch to talk it through.",
  detailsInvite: "Want a more accurate quote? Tell us about the copier you have now. A photo of its label is the quickest way.",
  detailsButton: "Add copier details",
  detailsHeading: "About your current copier",
  detailsHint: "All of this is optional. Share whatever you have.",
  detailsSubmit: "Send details",
  detailsThanksHeading: "Thank you. That helps.",
  detailsThanksBody: "We’ll use it to prepare your quote.",
};

export const ACCOUNTING: AccountingCopy = {
  hero: {
    statement: "Copiers and printers from CTWP in Bryan. When one stops on a deadline, our own technicians fix it.",
    fine: "Three questions. Then someone from our Bryan office calls you.",
  },
  ask: {
    lead: SINCE_1979,
    heading: "How can we help your office before tax season?",
    intro: "Pick one to start your quote.",
  },
  benefits: {
    heading: "Where a copier matters in an accounting office.",
    items: [
      { icon: "stack", title: "Scan a client’s whole stack in one pass.", body: "Statements, receipts and signed forms go through the feeder together and come out as one PDF." },
      { icon: "lock", title: "Keep client records private.", body: "With secure print, pages wait until the person who sent them is at the machine, so statements and Social Security numbers don’t sit in the tray." },
      { icon: "cost", title: "Know what the copier costs each month.", body: "Lease, toner, page charges and service. Show us what you pay now and we’ll put our quote beside it." },
      { icon: "season", title: "Ready for the busy weeks.", body: "Year-end and tax deadlines are when a copier can’t stop. If it does, the technician who comes is one of ours, from Bryan." },
    ],
  },
  timing: {
    heading: "Make the change before tax season.",
    body: "Changing copiers is easiest before your clients’ W-2s and 1099s start arriving, not in the middle of it. Starting now leaves time to compare, decide and set it up before January.",
  },
  form: {
    ...FORM_COMMON,
    help: [
      "I need a new copier or printer",
      COSTS_OPTION,
      "Scanning client files takes too long",
      SERVICE_OPTION,
      NOT_SURE_OPTION,
    ],
    timing: ["As soon as possible", "Before tax season", "After tax season", "Just looking for now"],
  },
};

export const TAX: AccountingCopy = {
  hero: {
    statement: "Get a copier ready for tax season. CTWP sells and services them from Bryan, with our own technicians.",
    fine: "Three questions. Then someone from our Bryan office calls you.",
  },
  ask: {
    lead: SINCE_1979,
    heading: "What would you like ready before tax season?",
    intro: "Pick one to start your quote.",
  },
  benefits: {
    heading: "Built for tax season.",
    items: [
      { icon: "season", title: "Ready for the busiest weeks.", body: "From the first W-2s to the April deadline, the copier can’t stop. If it does, the technician who comes is one of ours, from Bryan." },
      { icon: "stack", title: "Scan W-2s, 1099s and receipts in one pass.", body: "A client’s whole folder goes through the feeder together and comes out as one PDF." },
      { icon: "lock", title: "Keep returns private.", body: "With secure print, a return prints only when the preparer who sent it is at the machine, so Social Security numbers don’t sit in the tray." },
      { icon: "cost", title: "Know what the copier costs each month.", body: "Lease, toner, page charges and service. Show us what you pay now and we’ll put our quote beside it." },
    ],
  },
  timing: {
    heading: "Your busy season starts in January.",
    body: "A copier is easiest to change before the first client walks in with a folder of W-2s. Starting now leaves time to compare, decide and set it up before then.",
  },
  form: {
    ...FORM_COMMON,
    help: [
      "I need a copier before tax season",
      COSTS_OPTION,
      "Scanning W-2s and 1099s takes too long",
      SERVICE_OPTION,
      NOT_SURE_OPTION,
    ],
    timing: ["As soon as possible", "Before tax season starts", "After this tax season", "Just looking for now"],
  },
};

/* The featured machine and its three-tier color program.
   AWAITING CONFIRMATION FROM RYAN: the exact three-tier wording and the featured model.
   Source so far: ctwp.com says the Kyocera TASKalfa 5053i "comes with a 3-tier pricing program".
   No prices or numbers on purpose. */
export const FEATURED = {
  brand: "Kyocera",
  model: "TASKalfa 5053i",
  image: "/accounting/models/kyocera-taskalfa-5053i.webp",
  width: 515,
  height: 600,
  heading: "A color logo shouldn’t bill like a color photo.",
  body: "The Kyocera TASKalfa 5053i comes with a three-tier color program. Each page is billed by how much color is on it, so letterhead with your logo or one highlighted line costs less than a full-color page.",
  tiers: [
    { name: "A little color", note: "Lowest color rate" },
    { name: "Some color", note: "Middle color rate" },
    { name: "Full color", note: "Full color rate" },
  ],
};

/* Proof: the same for accounting and tax. Facts are from ctwp.com. */
export const PROOF = {
  heading: "Sold, leased and serviced from Bryan.",
  body: "Our office is on East Villa Maria Road. The technicians who keep our copiers and printers running work for CTWP, here in town.",
  customersLabel: "Customers include",
  badgesLabel: "Recognized for service",
  badges: [
    { src: "/accounting/badges/enx-elite-dealer-2025.jpg", alt: "ENX Magazine Elite Dealer 2025" },
    { src: "/accounting/badges/km-pro-tech-2025.jpg", alt: "Konica Minolta Pro-Tech Service Center 2025" },
    { src: "/accounting/badges/xerox-platinum.png", alt: "Xerox Platinum Authorized Dealer" },
    { src: "/accounting/badges/bta-navy.png", alt: "A long time member of the Business Technology Association" },
  ],
  customers: [
    { src: "/accounting/customers/tamu.png", name: "Texas A&M University" },
    { src: "/accounting/customers/bryan-isd.png", name: "Bryan ISD" },
    { src: "/accounting/customers/college-station.png", name: "City of College Station" },
    { src: "/accounting/customers/bcs-chamber.png", name: "B/CS Chamber of Commerce" },
  ],
};

/* Machines for the slideshow (components/ModelShowcase.tsx). Not shown on the focus page; kept for other versions.
   Names, photos and descriptions come from ctwp.com (checked November 11, 2026). */
export const EQUIPMENT = {
  models: [
    { brand: "Konica Minolta", model: "bizhub C360i", type: "Color copier for small and mid-size offices", image: "/accounting/models/konica-minolta-bizhub-c360i.webp", width: 1000, height: 792 },
    { brand: "Kyocera", model: "TASKalfa 5053i", type: "High-speed copier for mid-size offices", image: "/accounting/models/kyocera-taskalfa-5053i.webp", width: 515, height: 600 },
    { brand: "Lexmark", model: "XC4143", type: "Color multifunction printer", image: "/accounting/models/lexmark-xc4143.webp", width: 616, height: 800 },
    { brand: "Canon", model: "imageRUNNER ADVANCE 8505i", type: "Production printer", image: "/accounting/models/canon-imagerunner-advance-8505i.webp", width: 982, height: 486 },
  ],
};

/** Wording for a segment inside the accounting niche. Add a segment here when one needs its own copy. */
export function accountingCopy(segment?: string | null): AccountingCopy {
  return segment?.trim().toLowerCase() === "tax prep" ? TAX : ACCOUNTING;
}
