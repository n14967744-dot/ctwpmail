import type { LawPractice } from './law-content';

// Published Bryan office line; Ryan's direct contact has not been supplied.
// Source: https://www.ctwp.com/bryan/
export const LAW_OFFICE_PHONE = '(979) 779-2998';
export const LAW_OFFICE_HREF = 'tel:+19797792998';

export const additionalSolutions = [
  ['Know what each month really costs.', 'A lease payment is only part of the picture. We’ll review included pages, color and black-and-white rates, overages, supplies, and service to look for avoidable spending and compare the full cost of your options.'],
  ['When the copier stops, the deadline doesn’t.', 'An equipment problem can interrupt hearing prep, client meetings, or everyday work. CTWP’s local team can help with service, supplies, and training. We’ll review what your firm needs, what a service agreement covers, and how to get help when you need it.'],
  ['A busy day needs more than a fast printer.', 'Large document sets, urgent copies, and everyday scanning can compete for the same machine. We’ll review capacity, paper sizes, trays, and finishing around your busiest days, then consider the right mix of shared equipment and desktop printers.'],
] as const;

export const practiceRepFocus: Record<LawPractice, { title: string; copy: string }> = {
  general: { title: 'Your workflow comes first.', copy: 'Client packets, correspondence, signed originals, and shared printers all put different demands on an office. I’ll work through those routines with your team, then compare equipment, service, and ongoing costs around what you actually need.' },
  'personal-injury': { title: 'From medical records to demand packets.', copy: 'A personal-injury file can mean large record bundles, color exhibits, and repeated client copies. I’ll focus the review on scanning those records, assembling complete sets, handling sensitive printouts, and understanding what that volume costs.' },
  criminal: { title: 'Built around discovery and hearing prep.', copy: 'Discovery, reports, exhibits, and last-minute hearing packets can put pressure on the same machine. I’ll help your team review scanning, mixed paper sizes, finishing, and private pickup—alongside the service and page costs that come with them.' },
  family: { title: 'Sensitive records. Complete hearing sets.', copy: 'Financial statements, intake forms, and supporting records need both careful handling and clear organization. I’ll help review scanning, packet preparation, and print access, then look at the full equipment and service cost with you.' },
  estate: { title: 'From signing sets to retained copies.', copy: 'Wills, trusts, and probate packets call for consistent copies and a clear path from signed paper to the digital file. I’ll focus on paper handling, finishing, scanning, and the cost of maintaining a setup that fits your workload.' },
  immigration: { title: 'Every supporting document has a place.', copy: 'Applications, identity documents, and supporting evidence arrive in different sizes and conditions. I’ll help review copy clarity, scanning, complete packet assembly, and private pickup, with a close look at equipment and ongoing costs.' },
  'real-estate': { title: 'Ready for revisions and closing sets.', copy: 'Letter and legal pages, revised agreements, and signed closing documents need a dependable route through the office. I’ll focus on trays, complete sets, scanning, and installation timing, then compare the full cost of suitable options.' },
  business: { title: 'Contracts, exhibits, and one more revision.', copy: 'Revised agreements and exhibit sets can change right before a meeting. I’ll help review document preparation, scanning, access controls, and capacity around that workload, while checking service terms and avoidable printing costs.' },
  bankruptcy: { title: 'Make the supporting paperwork manageable.', copy: 'Financial records, schedules, and client copies can create substantial sets of sensitive paperwork. I’ll focus on scanning, packet preparation, controlled pickup, and a cost comparison that reflects how much your office actually prints.' },
};
