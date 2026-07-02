import "../../styles/home/cta.css"

export default function CtaBand() {
  return (
    <section className="news-section section">
      <div className="container">
        <div className="cta-band" data-aos="zoom-in">
          <span className="eyebrow justify-content-center">جاهزون عندما تكون أنت جاهزاً</span>
          <h2 className="mt-3">جاهز للعب؟</h2>
          <p>جميع ملاعب المنصورة على بُعد بحث واحد. ابحث عن مكانك وانضم إلى الملعب اليوم.</p>
          <a href="#courts" className="btn btn-accent">
            اكتشف ملعبك <i className="fa-solid fa-circle-arrow-left" />
          </a>
        </div>
      </div>
    </section>
  );
}
