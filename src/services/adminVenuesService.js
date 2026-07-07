import { createClient } from "@/lib/supabase/server";

export async function getAllVenuesForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .select("id, name, address, phone, email, status, created_at, owner:profiles!venues_owner_id_fkey(name, phone), courts(id, name, price_per_hour)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
