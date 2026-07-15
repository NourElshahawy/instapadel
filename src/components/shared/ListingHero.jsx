import Link from "next/link";
// import "@/styles/pages/courts.css";

export default function ListingHero({titlehead, title, count }) {
  return (
    <section className="listing-hero">
      <div className="container">
        <div className="breadcrumb-ph" data-aos="fade-up">
          <Link href="/">الرئيسية</Link>
          <i className="fa-solid fa-angles-right"></i>
          <span>{titlehead}</span>
        </div>

        <h1 data-aos="fade-up" data-aos-delay="60">
          {title}
        </h1>
        <p className="results-count" data-aos="fade-up" data-aos-delay="100">
          <b>{count}</b> {count === 1 ? `${titlehead} ملعب متاح` : `${titlehead} ملاعب متاحة`}
        </p>
      </div>
    </section>
  );
}
