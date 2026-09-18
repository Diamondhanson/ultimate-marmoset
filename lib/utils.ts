/** "8 weeks old" / "4 months old" from an ISO date of birth. */
export function formatAge(dateOfBirth: string): string {
  const born = new Date(dateOfBirth).getTime();
  if (Number.isNaN(born)) return "";
  const weeks = Math.max(0, Math.floor((Date.now() - born) / (7 * 24 * 60 * 60 * 1000)));
  if (weeks < 1) return "Newborn";
  if (weeks < 16) return `${weeks} week${weeks === 1 ? "" : "s"} old`;
  const months = Math.floor(weeks / 4.345);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} old`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} old`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
