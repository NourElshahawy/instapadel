import Hero from "@/components/home/Hero";
import FeaturedCourts from "@/components/home/FeaturedCourts";
import NewsSection from "@/components/home/NewsSection";
import CtaBand from "@/components/home/CtaBand";
import WhyUs from "@/components/home/WhyUs";

export const metadata = {
  title: "حجز ملعب بادل في المنصورة | InstaPadel",
  description: "احجز ملعب بادل في المنصورة أونلاين في ثوانٍ. قارن أسعار كل ملاعب وكورتات البادل، شوف المواعيد المتاحة فورًا، واحجز أقرب ملعب بادل من موقعك مع InstaPadel.",
  keywords: [
    "حجز ملعب بادل المنصورة",
    "ملاعب بادل المنصورة",
    "ملعب بادل المنصورة",
    "بادل المنصورة",
    "حجز بادل المنصورة",
    "حجز ملعب بادل",
    "أقرب ملعب بادل من موقعي",
    "Padel Mansoura",
    "Padel Courts Mansoura",
  ],
};
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCourts />
      <CtaBand />
      <NewsSection />
      <WhyUs />
    </>
  );
}
