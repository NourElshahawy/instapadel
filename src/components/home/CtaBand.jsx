import Link from "next/link";
import "../../styles/home/cta.css"
import ParallaxBg from "../ui/ParallaxBg";

export default function CtaBand() {
  return (
    <section className="news-section section">
      <ParallaxBg image="/assets/imgs/courts-bg.png" />
      <div className="container">
        <div className="cta-band" data-aos="zoom-in">
          <span className="eyebrow justify-content-center">جاهزون عندما تكون أنت جاهزاً</span>
          <h2 className="mt-3">جاهز للعب؟</h2>
          <p>جميع ملاعب المنصورة على بُعد بحث واحد. ابحث عن مكانك وانضم إلى الملعب اليوم.</p>
          <Link href="/find-partner" className="btn btn-accent">
            البحث عن شريك <i className="fa-solid fa-circle-arrow-left" style={{color:"#000"}} />
          </Link>
        </div>
      </div>
    </section>
  );
}
