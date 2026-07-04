import { fetchJson } from "./api";

export async function getAllTournaments() {
  return fetchJson("tournaments.json");
}

export async function getTournamentById(id) {
  const tournaments = await getAllTournaments();
  return tournaments.find((t) => t.id === id) || null;
}

// TODO: createTournament / joinTournament / startTournament / submitMatchResult
// TODO: الدوال دي محتاجة تتحول لـ API حقيقي (POST/PATCH) لما الباك إند يشتغل
// export async function createTournament(data) { ... }
// export async function joinTournament(tournamentId, team) { ... }
// export async function startTournament(tournamentId) { ... }
// export async function submitMatchResult(tournamentId, matchId, scoreA, scoreB) { ... }
