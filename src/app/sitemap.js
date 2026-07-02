import { getAllCourts } from "@/services/courtService";
import { getAllNews } from "@/services/newsService";

const BASE_URL = "https://instapadel.vercel.app";

export default async function sitemap() {
  const courts = (await getAllCourts()) ?? [];
  const news = (await getAllNews()) ?? [];

  // روابط ثابتة (الصفحات الرئيسية)
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/courts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // ضيف أي صفحات ثابتة تانية هنا، مثلًا:
    // { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    // { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // روابط ديناميكية لكل ملعب
  const courtRoutes = courts.map((court) => ({
    url: `${BASE_URL}/courts/${court.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // روابط ديناميكية لكل خبر
  const newsRoutes = news.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courtRoutes, ...newsRoutes];
}
