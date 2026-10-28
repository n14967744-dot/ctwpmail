import { OFFICE_MAPS_QUERY } from "./site";

export function officeMapLinks(origin: string | null = "") {
  const destination = encodeURIComponent(OFFICE_MAPS_QUERY);
  const start = origin?.trim() || "";
  return {
    embed: start
      ? `https://maps.google.com/maps?saddr=${encodeURIComponent(start)}&daddr=${destination}&output=embed`
      : `https://maps.google.com/maps?q=${destination}&z=15&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1${start ? `&origin=${encodeURIComponent(start)}` : ""}&destination=${destination}`,
  };
}
