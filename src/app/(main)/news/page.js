import NewsListing from "@/_pages/news/NewsListing";
import { getAllNews } from "@/services/newsService";

export const metadata = {
  alternates: { canonical: "/news" },
  title: "الأخبار والبطولات — PadelGo",
  description: "آخر أخبار وتحديثات ملاعب البادل في المنصورة.",
};

export default async function NewsPage() {
  const news = await getAllNews();
  return <NewsListing news={news} />;
}
