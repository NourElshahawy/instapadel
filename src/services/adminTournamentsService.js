import { createClient } from "@/lib/supabase/server";

export async function getAllTournamentsForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, status, venue_name, tournament_date, max_teams, champion_team_name, profiles!tournaments_organizer_id_fkey(name), tournament_teams(count)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    venue: t.venue_name,
    date: t.tournament_date,
    maxTeams: t.max_teams,
    teamsCount: t.tournament_teams[0]?.count ?? 0,
    organizerName: t.profiles?.name || "—",
    champion: t.champion_team_name,
  }));
}
