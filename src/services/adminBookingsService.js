import { createClient } from "@/lib/supabase/server";

export async function getAllBookingsForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("id, venue_name, court_name, date, time, price, status, payment_status, created_at, profiles(name, phone, email)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((b) => ({
    id: b.id,
    venueName: b.venue_name,
    courtName: b.court_name,
    date: b.date,
    time: b.time,
    price: b.price,
    status: b.status,
    paymentStatus: b.payment_status,
    customerName: b.profiles?.name || "—",
    customerPhone: b.profiles?.phone || "—",
    customerEmail: b.profiles?.email || "—",
    createdAt: b.created_at,
  }));
}
