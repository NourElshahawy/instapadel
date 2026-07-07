"use client";
import { createClient } from "@/lib/supabase/client";

export async function updateCourtPrice(courtId, newPrice) {
  const supabase = createClient();
  const { error } = await supabase.from("courts").update({ price_per_hour: newPrice }).eq("id", courtId);
  if (error) throw error;
}