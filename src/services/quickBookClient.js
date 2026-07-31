"use client";
import { createClient } from "@/lib/supabase/client";

export async function getAvailableCourtsForSlots(date, slots) {
  const supabase = createClient();
  const fullTimes = slots.map((s) => `${s.start} الي ${s.end}`);

  const { data: venues, error } = await supabase.from("venues").select("id, name, address, courts(id, name, price_per_hour, images)").eq("status", "approved");
  if (error) throw error;

  const allCourts = venues.flatMap((v) =>
    (v.courts || []).map((c) => ({
      courtId: c.id,
      courtName: c.name,
      venueName: v.name,
      venueId: v.id,
      pricePerHour: c.price_per_hour,
      image: c.images?.[0] || "/assets/imgs/img1.jpg",
    })),
  );

  if (allCourts.length === 0) return [];
  const courtIds = allCourts.map((c) => c.courtId);
  const startTimes = slots.map((s) => s.start);

  const [{ data: booked }, { data: blocked }] = await Promise.all([
    supabase.from("booking_slots").select("court_id, time").in("court_id", courtIds).eq("date", date).in("time", fullTimes).eq("status", "confirmed"),
    supabase.from("blocked_slots").select("court_id, time").in("court_id", courtIds).eq("date", date).in("time", startTimes),
  ]);

  const unavailableCourtIds = new Set([...(booked || []).map((b) => b.court_id), ...(blocked || []).map((b) => b.court_id)]);

  return allCourts
    .filter((c) => !unavailableCourtIds.has(c.courtId))
    .map((c) => ({
      ...c,
      slots,
      totalPrice: c.pricePerHour * slots.length,
    }));
}

export async function bookSlotsNow({ courtId, courtName, venueName, date, slots, pricePerHour }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const err = new Error("NOT_LOGGED_IN");
    err.code = "NOT_LOGGED_IN";
    throw err;
  }

  const groupId = crypto.randomUUID();
  const rows = slots.map((s) => ({
    user_id: user.id,
    court_id: courtId,
    venue_name: venueName,
    court_name: courtName,
    date,
    time: `${s.start} الي ${s.end}`,
    price: pricePerHour,
    status: "confirmed",
    group_id: groupId,
  }));

  const { data, error } = await supabase.from("bookings").insert(rows).select();
  if (error) throw error;
  return data[0];
}
