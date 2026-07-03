import { fetchJson } from "./api";

export async function getAllCourts() {
  return fetchJson("courts.json");
}
export async function getFeaturedCourts() {
  // const courts = await fetchJson("courts.json");
  const courts = await getAllCourts();
  return courts;
}
export async function getCourtDetails(slug) {
  const [courts, details] = await Promise.all([getAllCourts(), fetchJson("court-details.json")]);

  const court = courts.find((c) => c.slug === slug);
  if (!court) return null;

  return { ...court, ...(details[slug] || {}) };
}
