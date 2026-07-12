"use client";
import Image from "next/image";
import "../../styles/home/hero.css";
import "../../styles/home/search.css";
import ParallaxBg from "../ui/ParallaxBg";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TimePeriodChips from "./TimePeriodChips";

function getTodayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}
export default function Hero() {
  const router = useRouter();
  const dateRef = useRef(null);
  // const [timePeriod, setTimePeriod] = useState("");

  const goToCourts = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dateRef.current?.value) params.set("date", dateRef.current.value);
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
          إمكانية الوصول المباشر إلى أكثر من 10 ملاعب
        </span>

        <h1 data-aos="fade-up" data-aos-delay="80">
          جميع ملاعب البادل في
          <br />
          <span className="accent-underline">مكان واحد</span>
        </h1>

        <p className="hero-sub" data-aos="fade-up" data-aos-delay="160">
          وفر وقتك في البحث والتواصل، واعثر على الملعب المناسب والمواعيد المتاحة فورًا.
        </p>

        {/* <div className="search-grid tournament-cta">
            <Link href="/tournaments/create" className="search-submit ">
              <i className="fa-solid fa-trophy"></i>
              <span className="submit-text">إنشاء بطولة</span>
            </Link>
          </div> */}
        <div className="search-card" data-aos="fade-up" data-aos-delay="240">
          <div className="search-card-label">
            <span className="pulse-dot" />
            ابحث عن ملعب متاح دلوقتي
          </div>

          <div className="search-grid">
            <div className="search-field">
              <label>
                <i className="fa-solid fa-calendar-days" /> التاريخ
              </label>
              <input type="date" ref={dateRef} defaultValue={getTodayISO()} />
            </div>

            <a href="/courts" className="search-submit" onClick={goToCourts}>
              <i className="fa-solid fa-table-tennis-paddle-ball submit-icon"></i>
              <span className="submit-text">دور على ملعب</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
