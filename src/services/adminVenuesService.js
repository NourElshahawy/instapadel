import { createClient } from "@/lib/supabase/server";

export async function getAllVenuesForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("venues")
    .select("id, name, address, phone, email, status, created_at, owner:profiles!venues_owner_id_fkey(name, phone, email), courts(id, name, price_per_hour)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((v) => ({
    ...v,
    email: v.email || v.owner?.email || null, // لو الـ venue مالهاش إيميل، استخدم إيميل الأونر نفسه
  }));
}