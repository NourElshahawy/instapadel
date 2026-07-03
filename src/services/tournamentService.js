import { tournaments } from "@/data/tournaments";

export function getTournamentById(id) {
  return tournaments.find((t) => t.id == id);
}

export function getAllTournaments() {
  return tournaments;
}

export function createTournament(data) {
  const newTournament = {
    id: Date.now(),
    ...data,
    status: "registration",
    teams: [],
  };

  tournaments.push(newTournament);

  return newTournament;
}
