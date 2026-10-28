export function shortFirmName(businessName: string) {
  const name = businessName.trim()
    .replace(/,?\s+Attorneys (?:and Counselors )?at Law.*$/i, "")
    .replace(/,?\s+P\.?C\.?$/i, "")
    .trim();
  return name && name.length <= 42 ? name : "your firm";
}

export const legalHeroCopy = {
  message: (businessName: string) => `CTWP is offering a personalized copier and service review specifically for ${shortFirmName(businessName)}—to help lower printing costs, simplify scanning, strengthen document security, and match your equipment to your practice’s day-to-day needs. Already have a copier? We can help with local service and support, too.`,
  mobileMessage: (businessName: string) => `CTWP is offering a personalized copier and service review for ${shortFirmName(businessName)}—to explore lower printing costs, easier scanning, stronger document security, and equipment that fits your daily work. Already have a copier? We can help with local service and support, too.`,
  action: "Explore my firm’s options",
};
