import { createClient } from "@/lib/supabase/server";

export async function getAdminOverview() {
  const supabase = await createClient();

  const [{ count: usersCount }, { count: venuesCount }, { count: pendingVenuesCount }, { count: bookingsCount }, { count: tournamentsCount }, { data: recentBookings }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("venues").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("venues").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("tournaments").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("price, status").neq("status", "cancelled"),
  ]);

  const totalRevenue = (recentBookings || []).reduce((sum, b) => sum + Number(b.price), 0);

  return {
    usersCount: usersCount || 0,
    venuesCount: venuesCount || 0,
    pendingVenuesCount: pendingVenuesCount || 0,
    bookingsCount: bookingsCount || 0,
    tournamentsCount: tournamentsCount || 0,
    totalRevenue,
  };
}
