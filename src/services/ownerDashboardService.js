import { createClient } from "@/lib/supabase/server";

export async function getOwnerOverview(ownerId) {
  const supabase = await createClient();

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, status, courts(id, name, price_per_hour)")
    .eq("owner_id", ownerId);

  const courtIds = (venues || []).flatMap((v) => v.courts.map((c) => c.id));

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, court_id, price, status, created_at")
    .in("court_id", courtIds.length ? courtIds : ["00000000-0000-0000-0000-000000000000"]);

  const totalRevenue = (bookings || [])
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + Number(b.price), 0);

  const totalBookings = bookings?.length || 0;
  const totalCourts = courtIds.length;
  const totalVenues = venues?.length || 0;

  // آخر 7 أيام لرسم بياني بسيط
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const revenueByDay = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("ar-EG", { weekday: "short" }),
    revenue: (bookings || [])
      .filter((b) => b.created_at?.startsWith(date) && b.status !== "cancelled")
      .reduce((sum, b) => sum + Number(b.price), 0),
  }));

  return { venues: venues || [], totalRevenue, totalBookings, totalCourts, totalVenues, revenueByDay };
}