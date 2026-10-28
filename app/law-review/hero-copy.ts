export function shortFirmName(businessName: string) {
  const name = businessName.trim()
    .replace(/,?\s+Attorneys (?:and Counselors )?at Law.*$/i, "")
    .replace(/,?\s+P\.?C\.?$/i, "")
    .trim();
  return name && name.length <= 42 ? name : "your firm";
}

export const legalHeroCopy = {
  message: (businessName: string) => `CTWP is offering ${shortFirmName(businessName)} a personalized review to explore lower printing costs, easier scanning, and stronger document security—with equipment options or local service for your current copier.`,
  action: "Explore my firm’s options",
};
