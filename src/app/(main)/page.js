import Hero from "@/components/home/Hero";
import FeaturedCourts from "@/components/home/FeaturedCourts";
import NewsSection from "@/components/home/NewsSection";
import CtaBand from "@/components/home/CtaBand";
import WhyUs from "@/components/home/WhyUs";

export const metadata = {
  title: "InstaPadel — Book Padel Courts in Mansoura",
  description: "InstaPadel gathers every padel court in Mansoura into one place. Compare prices, check real-time availability, and book your court in under a minute.",
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
