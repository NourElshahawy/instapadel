"use client";
import { createClient } from "@/lib/supabase/client";

export async function createTournament(data, organizerId) {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("tournaments")
    .insert({
      organizer_id: organizerId,
      name: data.name,
      type: data.type,
      venue_name: data.courtName,
      court_id: data.courtId,
      tournament_date: data.startDate,
      max_teams: data.teamsCount,
      entry_fee: data.entryFee || null,
      registration_deadline: data.registrationDeadline || null,
      starts_at: data.startDate ? new Date(data.startDate).toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;

  const { data: courtRow } = await supabase
    .from("courts")
    .select("images")
    .eq("id", data.courtId)
    .maybeSingle();

  await supabase.from("news").insert({
    source_type: "tournament",
    source_id: row.id,
    author_id: organizerId,
    title: `التسجيل مفتوح: بطولة ${row.name}`,
    body: `بطولة ${row.type === "double" ? "زوجي" : "فردي"} جديدة في ${row.venue_name}، محتاجة ${row.max_teams} فرق. سجّل فريقك الآن.`,
    image_url: courtRow?.images?.[0] || null, // ← جديد
    category: "tournament",
    status: "published",
  });

  return row;
}
export async function joinTournament(tournamentId, teamData, captainId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tournament_teams")
    .insert({
      tournament_id: tournamentId,
      captain_id: captainId,
      name: teamData.partnerName ? `${teamData.captainName} & ${teamData.partnerName}` : teamData.captainName,
      captain_name: teamData.captainName,
      captain_phone: teamData.captainPhone,
      partner_name: teamData.partnerName || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function startTournament(tournamentId, rounds, matches) {
  const supabase = createClient();

  const rows = matches.map((m) => ({
    tournament_id: tournamentId,
    round: m.round,
    round_index: m.roundIndex,
    match_index: m.matchIndex,
    team_a_name: m.teamA,
    team_b_name: m.teamB,
  }));

  const { data: insertedMatches, error: matchesError } = await supabase.from("tournament_matches").insert(rows).select(); // ← نرجّع الصفوف الحقيقية بالـ UUID اللي Supabase ولّده

  if (matchesError) throw matchesError;

  const { error: updateError } = await supabase.from("tournaments").update({ status: "ready", first_match_at: new Date().toISOString() }).eq("id", tournamentId);
  if (updateError) throw updateError;

  return insertedMatches; // ← جديد، مهم
}

export async function submitMatchResult(matchId, scoreA, scoreB, nextMatchId, nextSlot, winnerName, isFinal, tournamentId) {
  const supabase = createClient();

  const { error: matchError } = await supabase.from("tournament_matches").update({ score_a: scoreA, score_b: scoreB, is_done: true }).eq("id", matchId);
  if (matchError) throw matchError;

  if (nextMatchId) {
    const field = nextSlot === "teamA" ? "team_a_name" : "team_b_name";
    await supabase
      .from("tournament_matches")
      .update({ [field]: winnerName })
      .eq("id", nextMatchId);
  }

  await supabase
    .from("tournaments")
    .update({
      status: isFinal ? "completed" : "live",
      champion_team_name: isFinal ? winnerName : null,
    })
    .eq("id", tournamentId);

  // خبر تلقائي لما البطولة تخلص وتتحدد النتيجة النهائية
  if (isFinal) {
    const { data: tournament } = await supabase.from("tournaments").select("name, venue_name, organizer_id").eq("id", tournamentId).single();

    if (tournament) {
      await supabase.from("news").insert({
        source_type: "tournament",
        source_id: tournamentId,
        author_id: tournament.organizer_id,
        title: `🏆 ${winnerName} بطل بطولة ${tournament.name}`,
        body: `انتهت بطولة ${tournament.name} في ${tournament.venue_name}، وتوّج ${winnerName} بلقب البطولة بعد منافسة قوية.`,
        category: "tournament",
        status: "published",
      });
    }
  }
}