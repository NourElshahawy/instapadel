import CourtsListing from "@/pages/courts/CourtsListing";
import { getAllCourts } from "@/services/courtService";

export const metadata = {
  title: "جميع ملاعب البادل في المنصورة — InstaPadel",
  description: "قارن كل ملاعب البادل في المنصورة، الأسعار، والمواعيد المتاحة فورًا.",
};

export default async function CourtsPage() {
  const courts = await getAllCourts();
  return <CourtsListing courts={courts} />;
}
