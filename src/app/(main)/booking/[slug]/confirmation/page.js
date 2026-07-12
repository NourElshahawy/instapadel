// import BookingConfirmationPage from "@/components/pages/booking/confirmation/";
import { getCourtDetails } from "@/services/courtService";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BookingConfirmationPage from "@/components/pages/confirmation/BookingConfirmationPage";

export const metadata = { title: "تأكيد الحجز — InstaPadel" };

function generateBookingId() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `#IP-${y}${m}${d}-${rand}`;
}

export default async function ConfirmationPage({ params, searchParams }) {
  const { slug } = await params;
  const court = await getCourtDetails(slug);
  if (!court) notFound();

  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookingRow } = await supabase.from("bookings").select("status, payment_status").eq("id", sp.bookingId).maybeSingle();

  const booking = {
    id: sp.bookingId || generateBookingId(),
    venueName: sp.court || court.name,
    venueImage: court.coverImage || court.image,
    location: court.location,
    locationLink: court.locationLink,
    subCourtName: sp.subCourt || "—",
    date: sp.date || "—",
    time: sp.time || "—",
    price: sp.price || court.pricePerHour,
    email: user?.email || "—",
    createdAt: "اليوم",
    status: bookingRow?.status || "confirmed", // ← جديد
  };

  return <BookingConfirmationPage booking={booking} />;
}
