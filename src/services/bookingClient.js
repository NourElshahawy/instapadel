"use client";
import { createClient } from "@/lib/supabase/client";

export async function cancelBooking(bookingId) {
  const supabase = createClient();
  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
  if (error) throw error;
}
