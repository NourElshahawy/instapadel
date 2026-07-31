import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "غير مسموح" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "owner") return Response.json({ error: "غير مسموح" }, { status: 403 });

  const body = await request.json();
  const { name, email, phone, password, venueId, shiftSchedule } = body;

if (!name || !email || !password || !venueId) {
  return Response.json({ error: "بيانات ناقصة" }, { status: 400 });
}

const finalVenueId = venueId === "all" ? null : venueId;

if (finalVenueId) {
  const { data: venue } = await supabase.from("venues").select("id").eq("id", finalVenueId).eq("owner_id", user.id).maybeSingle();
  if (!venue) return Response.json({ error: "الملعب ده مش بتاعك" }, { status: 403 });
}
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone, role: "staff" },
  });

  if (createError) return Response.json({ error: createError.message }, { status: 400 });

  const newId = created.user.id;

  const { error: profileError } = await admin.from("profiles").upsert({ id: newId, name, phone, role: "staff" });
  if (profileError) return Response.json({ error: profileError.message }, { status: 400 });

const { error: staffError } = await admin.from("staff").insert({
  id: newId,
  owner_id: user.id,
  venue_id: finalVenueId,
  name,
  phone,
  shift_schedule: shiftSchedule || [],
});
  if (staffError) return Response.json({ error: staffError.message }, { status: 400 });

  return Response.json({ success: true, id: newId });
}
