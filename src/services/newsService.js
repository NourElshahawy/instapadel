import { fetchJson } from "./api";

export async function getAllNews() {
  return fetchJson("news.json");
}

export async function getFeaturedArticle() {
  const news = await getAllNews();
  return news.find((n) => n.featured) || news[0];
}

export async function getNewsBySlug(slug) {
  const news = await getAllNews();
  return news.find((n) => n.slug === slug) || null;
}
