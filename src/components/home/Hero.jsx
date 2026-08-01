"use client";
import Image from "next/image";
import "../../styles/home/hero.css";
import "../../styles/home/search.css";
import ParallaxBg from "../ui/ParallaxBg";
import { useState, useMemo } from "react";
import { buildDefaultSlots } from "@/services/courtLogic";
import QuickBookModal from "./QuickBookModal";

function getTodayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

function addDaysISO(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().split("T")[0];
}

const SLOTS = buildDefaultSlots(0);

export default function Hero() {
  const [date, setDate] = useState(getTodayISO());
  const [startIndex, setStartIndex] = useState(16);
  const [endIndex, setEndIndex] = useState(17);
  const [showModal, setShowModal] = useState(false);

  // لو "لحد الساعة" أصغر من "من الساعة"، معناها الامتداد لليوم اللي بعده
  const crossesMidnight = endIndex < startIndex;

  const selectedSlots = useMemo(() => {
    if (!crossesMidnight) {
      return SLOTS.slice(startIndex, endIndex + 1).map((s) => ({ ...s, date }));
    }
    const day1 = SLOTS.slice(startIndex).map((s) => ({ ...s, date }));
    const nextDate = addDaysISO(date, 1);
    const day2 = SLOTS.slice(0, endIndex + 1).map((s) => ({ ...s, date: nextDate }));
    return [...day1, ...day2];
  }, [date, startIndex, endIndex, crossesMidnight]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowModal(true);
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
          <Image src="/assets/imgs/logo1-removebg-preview.png" className="pulse-img" alt="" width={20} height={20} />
          ملعب احترافي في قلب المنصورة
        </span>

        <h1 data-aos="fade-up" data-aos-delay="80">
          احجز ملعبك في
          <br />
          <span className="accent-underline">PadelGo</span>
        </h1>

        <p className="hero-sub" data-aos="fade-up" data-aos-delay="160">
          ملعبين بادل احترافيين، شوف المواعيد المتاحة فورًا واحجز مكانك في ثوانٍ.
        </p>

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
              <input type="date" value={date} min={getTodayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="search-field">
              <label>
                <i className="fa-solid fa-clock" /> من الساعة
              </label>
              <select value={startIndex} onChange={(e) => setStartIndex(Number(e.target.value))}>
                {SLOTS.map((s, i) => (
                  <option key={s.start} value={i}>
                    {s.start}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-field">
              <label>
                <i className="fa-solid fa-clock" /> لحد الساعة
              </label>
              <select value={endIndex} onChange={(e) => setEndIndex(Number(e.target.value))}>
                {SLOTS.map((s, i) => (
                  <option key={s.end} value={i}>
                    {s.end}
                  </option>
                ))}
              </select>
              {crossesMidnight && <span className="search-field-hint">هيمتد لليوم اللي بعده</span>}
            </div>

            <button type="button" className="search-submit" onClick={handleSearch}>
              <i className="fa-solid fa-table-tennis-paddle-ball submit-icon"></i>
              <span className="submit-text">دور على ملعب</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && <QuickBookModal slots={selectedSlots} onClose={() => setShowModal(false)} />}
    </section>
  );
}
