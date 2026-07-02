import { fetchJson } from "./api";
import { getAllNews } from "./newsService";

export async function getHomeNews() {
  // const home = await fetchJson("home.json");
  // return home.news;
  const news = await getAllNews();
  const featured = news.find((n) => n.featured) || news[0];
  const items = news.filter((n) => n.id !== featured.id).slice(0, 3);
  return {
    featured: {
      id: featured.id,
      tag: featured.category,
      tagLabel: featured.categoryLabel,
      title: featured.title,
      excerpt: featured.excerpt,
      date: featured.date,
      image: featured.image,
      href: `/news/${featured.slug}`,
    },
    items: items.map((n) => ({
      id: n.id,
      tag: n.category,
      tagLabel: n.categoryLabel,
      title: n.title,
      date: n.date,
      image: n.image,
      href: `/news/${n.slug}`,
    })),
  };
}
