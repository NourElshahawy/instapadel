"use client";
import { createClient } from "@/lib/supabase/client";

export async function createPartnerRequest(form, hostId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_requests")
    .insert({
      host_id: hostId,
      court_id: form.courtId,
      court_name: form.courtName,
      request_date: form.date,
      time_label: form.time,
      level: form.level,
      players_needed: form.playersNeeded,
      notes: form.notes || null,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase.from("news").insert({
    source_type: "partner_request",
    source_id: data.id,
    author_id: hostId,
    title: `محتاج ${form.playersNeeded} ${form.playersNeeded === 1 ? "لاعب" : "لاعبين"} في ${form.courtName}`,
    body: `مستوى ${form.level} — ${form.date} الساعة ${form.time}. اضغط للانضمام.`,
    category: "announcement",
    status: "published",
  });

  return data;
}

export async function joinPartnerRequest(requestId, playerId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("partner_request_joins")
    .insert({ request_id: requestId, player_id: playerId });
  if (error) throw error;

  await supabase
    .from("partner_requests")
    .update({ status: "partially_filled" })
    .eq("id", requestId)
    .eq("status", "open");
}

export async function respondToJoin(joinId, requestId, accept, playersNeeded) {
  const supabase = createClient();

  const { error } = await supabase
    .from("partner_request_joins")
    .update({ status: accept ? "accepted" : "rejected" })
    .eq("id", joinId);
  if (error) throw error;

  if (accept) {
    const { count } = await supabase
      .from("partner_request_joins")
      .select("*", { count: "exact", head: true })
      .eq("request_id", requestId)
      .eq("status", "accepted");

    if (count >= playersNeeded) {
      await supabase.from("partner_requests").update({ status: "matched" }).eq("id", requestId);
    }
  }
}