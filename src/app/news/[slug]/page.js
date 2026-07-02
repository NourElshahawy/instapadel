import { notFound } from "next/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import NewsArticleHeader from "@/pages/news/NewsArticleHeader";
import NewsArticleBody from "@/pages/news/NewsArticleBody";
import NewsArticleSidebar from "@/pages/news/NewsArticleSidebar";
import { getAllNews, getNewsBySlug } from "@/services/newsService";
import "@/styles/pages/news.css";
import Link from "next/link";

export async function generateStaticParams() {
  const news = await getAllNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;

  const article = await getNewsBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.title} — InstaPadel`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage(props) {
  const params = await props.params;
  const slug = params.slug;

  const article = await getNewsBySlug(slug);

  if (!article) notFound();

  return (
    <main className="details-hero">
      <div className="container">
        <div className="breadcrumb-ph">
          <Link href="/">الرئيسية</Link>
          <i className="fa-solid fa-angles-right"></i>
          <Link href="/news">الأخبار</Link>
          <i className="fa-solid fa-angles-right"></i>
          <span>{article.title}</span>
        </div>

        <NewsArticleHeader article={article} />

        <div className="article-hero-image mt-4">
          <ImageWithFallback src={article.image} alt={article.title} />
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            <NewsArticleBody body={article.body} />
          </div>

          <div className="col-lg-4">
            <NewsArticleSidebar sidebar={article.sidebar} />
          </div>
        </div>
      </div>
    </main>
  );
}
