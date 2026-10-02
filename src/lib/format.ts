export function formatVisitDate(date: string, full = false) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    ...(full ? { year: "numeric" } : {}),
  }).format(new Date(date));
}
