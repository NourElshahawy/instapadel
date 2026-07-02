"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../styles/home/hero.css";
import "../../styles/home/search.css";
import ParallaxBg from "../ui/ParallaxBg";

export default function Hero() {
  const router = useRouter();
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const goToCourts = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dateRef.current?.value) params.set("date", dateRef.current.value);
    if (timeRef.current?.value) params.set("time", timeRef.current.value);
    const qs = params.toString();
    router.push(`/courts${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="hero">
      <span className="hero-shape s1" />
      <span className="hero-shape s2" />
      <span className="hero-shape s3" />
      <span className="hero-shape s4" />
      <ParallaxBg image="/assets/imgs/img1.jpg" />

      <div className="container hero-content">
        <span className="hero-badge" data-aos="fade-up">
          <Image src="/assets/imgs/logo.png" className="pulse-img" alt="" width={20} height={20} />
          إمكانية الوصول المباشر إلى أكثر من 10 ملاعب في المنصورة
        </span>

        <h1 data-aos="fade-up" data-aos-delay="80">
          جميع ملاعب البادل في
          <br />
          <span className="accent-underline">مكان واحد</span>
        </h1>

        <p className="hero-sub" data-aos="fade-up" data-aos-delay="160">
          وفر وقتك في البحث والتواصل، واعثر على الملعب المناسب والمواعيد المتاحة فورًا.
        </p>

        <div className="search-card" data-aos="fade-up" data-aos-delay="240">
          <div className="search-card-label">
            <span className="pulse-dot" />
            ابحث عن ملعب متاح دلوقتي
          </div>

          <div className="search-grid">
            <div className="search-field">
              <label>
                <i className="fa-regular fa-calendar"></i>
                التاريخ
              </label>
              <div className="select-wrapper">
                <input type="date" ref={dateRef} />
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <label>
                <i className="fa-regular fa-calendar-days"></i>
                الوقت
              </label>
              <div className="select-wrapper">
                <i className="fa-solid fa-angle-down"></i>
                <select ref={timeRef} defaultValue="">
                  <option value="">أي وقت</option>
                  <option value="afternoon">بعد الظهر</option>
                  <option value="evening">مساءً</option>
                  <option value="night">ليلاً</option>
                </select>
              </div>
            </div>

            <a href="/courts" className="search-submit" onClick={goToCourts}>
              <span className="submit-text">دور على ملعب</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
