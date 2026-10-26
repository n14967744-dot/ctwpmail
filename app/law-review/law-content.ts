export const lawPractices = {
  general: {
    label: "General / multiple practices",
    examples: "Client packets, correspondence, and documents that need to become usable files.",
    points: [
      ["The packet is due. The stapler can wait.", "Mixed paper sizes, two-sided pages, and enough copies for everyone. Let’s look at paper handling and finishing that could take some of the handwork out of preparing a complete set."],
      ["A scan should be easy to use later.", "A clear page is a start. Finding it again matters, too. Show us how files reach the right folder, and we’ll review scanning, file naming, and any software needed for searchable PDFs."],
      ["Print it. Pick it up. Keep it yours.", "Client paperwork shouldn’t wait unattended on a shared tray. We’ll look at user access and print-release options that fit your team and the equipment you choose."],
    ],
  },
  "personal-injury": {
    label: "Personal injury",
    examples: "Medical-record bundles, demand packets, exhibits, and client copies.",
    points: [
      ["Build the packet. Skip some of the handwork.", "A demand packet or exhibit set can mix long records, color pages, and last-minute additions. Let’s review capacity, paper handling, and finishing around the sets your team prepares."],
      ["Make the next record easier to find.", "Paper records are useful only if they reach the right file. We’ll review scan handling, naming, and searchable-PDF options around your existing process."],
      ["The case file isn’t for the whole office.", "Medical records and client documents deserve a deliberate pickup process. Let’s review user access and print release, then confirm what your chosen setup supports."],
    ],
  },
  criminal: {
    label: "Criminal defense / DWI",
    examples: "Discovery, hearing packets, exhibits, and client correspondence.",
    points: [
      ["Ready for the hearing. Down to the last page.", "Discovery and exhibit sets can grow quickly. Let’s look at duplex printing, mixed paper sizes, and finishing that fit how your team prepares a complete packet."],
      ["Less rescanning. More useful files.", "Reports, handwritten pages, and supporting documents arrive in different forms. Show us your scanning routine so we can check feeding, file destinations, and searchable-PDF requirements."],
      ["Keep sensitive pages with the right person.", "On shared equipment, pickup matters as much as printing. We’ll review access and print-release options for the people who handle your case documents."],
    ],
  },
  family: {
    label: "Family / divorce",
    examples: "Financial statements, client intake, supporting records, and hearing packets.",
    points: [
      ["One packet. All the pieces in place.", "Financial statements, supporting records, and client copies can mean a lot of sorting. Let’s review paper handling and finishing around the sets your team builds."],
      ["Turn the paper pile into a usable file.", "Intake forms and financial records need a clear destination. We’ll walk through scanning, naming, and finding documents with the software your office actually uses."],
      ["Private matters. Thoughtful document handling.", "A shared output tray can complicate sensitive paperwork. Let’s look at user access and print release that suit the way your team works."],
    ],
  },
  estate: {
    label: "Estate planning / probate",
    examples: "Wills, trusts, signing packets, probate documents, and retained copies.",
    points: [
      ["The signing set should feel finished.", "Wills, trusts, and supporting documents need complete, consistent sets. Let’s review paper handling, duplex settings, and finishing around the packets your firm prepares."],
      ["Signed on paper. Easy to keep track of.", "Executed documents need to reach the right digital file. We’ll review scanning, file naming, and any searchable-PDF requirements around your current process."],
      ["Keep the right set with the right person.", "Client and retained copies need thoughtful handling. We’ll review pickup and access options for shared equipment, without assuming which controls you already have."],
    ],
  },
  immigration: {
    label: "Immigration",
    examples: "Applications, supporting documents, correspondence, and complete client sets.",
    points: [
      ["Every supporting page has a place.", "Forms and supporting documents can make for a substantial packet. Let’s look at paper handling, copying, and finishing that fit the sets your office prepares."],
      ["Copies and scans that are useful the first time.", "Small originals and mixed documents can make scanning fiddly. We’ll review feeding and platen options, file clarity, and destinations with representative samples."],
      ["Personal documents need a clear pickup process.", "Identity documents and applications deserve controlled handling. Let’s review user access and print release supported by a suitable configuration."],
    ],
  },
  "real-estate": {
    label: "Real estate / title work",
    examples: "Transaction files, closing sets, signed agreements, and client copies.",
    points: [
      ["The closing set has one more revision.", "Letter and legal pages, signature copies, and last-minute changes. Let’s review paper trays, duplex printing, and finishing around the documents you prepare."],
      ["Signed documents. A clear route to the file.", "Executed agreements should be easy to store and retrieve. We’ll review scanning destinations, naming, and software requirements around your office’s process."],
      ["Keep transaction paperwork off the shared pile.", "We’ll look at print-release and user-access options so sensitive pages can be collected by the right person."],
    ],
  },
  business: {
    label: "Business / civil litigation",
    examples: "Agreements, revised contracts, exhibits, and transaction packets.",
    points: [
      ["Another revision. The same deadline.", "Contracts and exhibit packets can change right before a meeting. Let’s look at capacity, paper handling, and finishing around the sets you need."],
      ["From signed agreement to usable file.", "Show us how paper reaches your digital folders. We’ll review scanning, naming, and searchable-PDF needs without assuming an integration with your existing software."],
      ["Shared equipment. Deliberate access.", "Commercial and client documents deserve a clear pickup process. We’ll review access and print-release options for the people using your equipment."],
    ],
  },
  bankruptcy: {
    label: "Bankruptcy",
    examples: "Financial records, schedules, supporting documents, and client copies.",
    points: [
      ["A complete set, without all the sorting.", "Schedules, supporting records, and client copies can add up. Let’s look at paper handling, duplex printing, and finishing that fit your packets."],
      ["Keep the paperwork moving into the file.", "Financial records arrive in different sizes and formats. We’ll review scanning and file destinations with your team’s actual documents and software needs."],
      ["Financial paperwork deserves careful pickup.", "Let’s review access and print release so sensitive pages needn’t sit unattended on a shared output tray."],
    ],
  },
} as const;

export type LawPractice = keyof typeof lawPractices;
export function resolveLawPractice(value?: string): LawPractice {
  return value && Object.prototype.hasOwnProperty.call(lawPractices, value) ? value as LawPractice : "general";
}
