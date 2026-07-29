"use client";
import { createClient } from "@/lib/supabase/client";

export async function updateBookingStatus(bookingId, status) {
  const supabase = createClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) throw error;
}

export async function confirmPaymentReceived(bookingId) {
  const supabase = createClient();
  const { error } = await supabase.from("bookings").update({ payment_status: "paid" }).eq("id", bookingId);
  if (error) throw error;
}
