/* Copy for the accounting and tax preparation landing page, as supplied by Nick on Nov 11, 2026.
   Same layout for both; tax preparation offices get the substitutions in TAX. */

export type AccountingCopy = {
  hero: { headline: string; lead: string; primary: string; secondary: string };
  help: { kicker: string; heading: string; intro: string; items: { icon: "scan" | "packet" | "costs"; title: string; body: string }[] };
  local: { kicker: string; heading: string; body: string; calloutTitle: string; calloutBody: string; calloutButton: string };
  form: { heading: string; intro: string; helpQuestion: string; help: string[]; timingQuestion: string; timing: string[]; submit: string; fine: string };
};

export const SERVICE_OPTION = "Service for existing equipment";

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
        icon: "scan",
        title: "Get client documents into usable digital files.",
        body: "Turn stacks of receipts, statements and signed forms into searchable PDFs. We’ll help you choose scanning features and destinations that fit how your team organizes client files.",
      },
      {
        icon: "packet",
        title: "Keep deadline work moving.",
        body: "Print reports, copy supporting documents and prepare client packets with equipment suited to your workload—and local service when something needs attention.",
      },
      {
        icon: "costs",
        title: "Get a clearer picture of printing costs.",
        body: "Lease payments, toner, page charges and service all affect what you spend. We’ll help you compare the full picture and find a setup that fits your office.",
      },
    ],
  },
  local: {
    kicker: "Right here in Bryan",
    heading: "Local support for the work you do every day.",
    body: "Your CTWP team is here in Bryan–College Station to help with equipment options, setup and ongoing service. Tell us what’s working, what’s slowing you down and what you’d like to improve.",
    calloutTitle: "Happy with your current copier?",
    calloutBody: "Tell us the make and model. We can check whether service and support are available for your equipment.",
    calloutButton: "Ask about service",
  },
  form: {
    /* {business} is replaced with the business name. */
    heading: "Let’s find the right fit for {business}.",
    intro: "Tell us what you’d like to improve. You don’t need model numbers or exact print volumes to get started.",
    helpQuestion: "What would you like help with?",
    help: [
      "Replacing or adding equipment",
      "Reviewing printing costs",
      "Improving scanning and document handling",
      SERVICE_OPTION,
      "Not sure—help me figure it out",
    ],
    timingQuestion: "When would you like to make a change?",
    timing: ["As soon as possible", "Before tax season", "After tax season", "Just exploring"],
    submit: "Request my quote",
    fine: "Our local team will review your needs and follow up to discuss options.",
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
        icon: "scan",
        title: "Make tax document intake easier.",
        body: "Scan W-2s, 1099s, receipts and supporting records into searchable PDFs, with scanning options that fit how your office organizes each client’s documents.",
      },
      {
        icon: "packet",
        title: "Be ready for the busiest weeks.",
        body: "Prepare client copies, scan signed forms and handle deadline-day volume with equipment chosen for your seasonal workload.",
      },
      ACCOUNTING.help.items[2],
    ],
  },
};
