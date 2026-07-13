"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import NewsFeatureBanner from "./NewsFeatureBanner";
import NewsFilterTabs from "./NewsFilterTabs";
import NewsCard from "./NewsCard";
import ListingHero from "@/components/shared/ListingHero";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import "../../styles/home/news.css";
// import "@/styles/pages/news.css";
import ParallaxBg from "@/components/ui/ParallaxBg";

const PAGE_SIZE = 6;

export default function NewsListing({ news }) {
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const safeNews = news || [];
  const featured = safeNews[0];
  const restNews = safeNews.filter((n) => n.id !== featured?.id);

  const filtered = useMemo(() => {
    if (category === "all") return restNews;
    return restNews.filter((n) => n.category === category);
  }, [restNews, category]);

  if (safeNews.length === 0) {
    return (
      <section className="section" style={{ paddingTop: 140, textAlign: "center" }}>
        <div className="container">
          <h1>الأخبار والبطولات</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 12 }}>لسه مفيش أخبار — أول بطولة أو طلب شريك هيظهر هنا فورًا.</p>
        </div>
      </section>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCategoryChange = (key) => {
    setCategory(key);
    setCurrentPage(1);
  };

  return (
    <>
      <ListingHero title="الأخبار والبطولات" count={news.length} breadcrumbLabel="الأخبار" />

      <section className="courts-section section" id="courts">
        <ParallaxBg />
        <div className="courts-overlay" />
        <div className="container">
          <NewsFeatureBanner article={featured} />
          <NewsFilterTabs active={category} onChange={handleCategoryChange} />

          {paginated.length > 0 ? (
            <div className="row g-4">
              {paginated.map((article, i) => (
                <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={(i % 3) * 60} key={article.id}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد أخبار في هذه الفئة بعد"
              text="تفقد مرة أخرى قريباً، أو تصفح جميع التحديثات بدلاً من ذلك."
              buttonLabel="عرض جميع الأخبار"
              onClear={() => handleCategoryChange("all")}
            />
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </section>
    </>
  );
}
