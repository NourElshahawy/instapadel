import { notFound } from "next/navigation";
import BookingPage from "@/components/pages/booking/BookingPage";
import { getCourtDetails } from "@/services/courtService";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const court = await getCourtDetails(slug);
  return { title: court ? `حجز ${court.name} — InstaPadel` : "ملعب غير موجود — InstaPadel" };
}

export default async function CourtBookingPage({ params }) {
  const { slug } = await params;
  const court = await getCourtDetails(slug);
  if (!court) notFound();

  return <BookingPage court={court} />;
}
