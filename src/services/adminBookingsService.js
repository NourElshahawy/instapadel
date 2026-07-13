import { createClient } from "@/lib/supabase/server";

export async function getAllBookingsForAdmin(page = 1, pageSize = 50) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("bookings")
    .select("id, venue_name, court_name, date, time, price, status, payment_status, created_at, profiles(name, phone, email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    bookings: (data || []).map((b) => ({
      id: b.id, venueName: b.venue_name, courtName: b.court_name, date: b.date, time: b.time,
      price: b.price, status: b.status, paymentStatus: b.payment_status,
      customerName: b.profiles?.name || "—", customerPhone: b.profiles?.phone || "—", customerEmail: b.profiles?.email || "—",
      createdAt: b.created_at,
    })),
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
