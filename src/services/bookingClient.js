"use client";
import { createClient } from "@/lib/supabase/client";

export async function cancelBooking(groupId) {
  const supabase = createClient();
  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("group_id", groupId);
  if (error) throw error;
}
