"use client";
import { createClient } from "@/lib/supabase/client";

export async function updateVenueStatus(venueId, status) {
  const supabase = createClient();
  const { error } = await supabase.from("venues").update({ status }).eq("id", venueId);
  if (error) throw error;
}
