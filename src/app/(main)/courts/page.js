import CourtsListing from "@/_pages/courts/CourtsListing";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "جميع ملاعب البادل في المنصورة — InstaPadel",
  description: "قارن كل ملاعب البادل في المنصورة، الأسعار، والمواعيد المتاحة فورًا.",
};

export default async function CourtsPage({ searchParams }) {
  const sp = await searchParams;
  const courts = await getAllCourts({ date: sp.date });

  return <CourtsListing courts={courts} searchFilters={{ date: sp.date }} />;
}
