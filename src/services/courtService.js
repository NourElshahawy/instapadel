import { fetchJson } from "./api";

export async function getAllCourts() {
  return fetchJson("courts.json");
}
export async function getFeaturedCourts() {
  // const courts = await fetchJson("courts.json");
  const courts = await getAllCourts();
  return courts;
}

