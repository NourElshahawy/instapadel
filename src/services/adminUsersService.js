import { createClient } from "@/lib/supabase/server";

export async function getAllUsersForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("id, name, phone, email, role, owner_status, created_at").order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
