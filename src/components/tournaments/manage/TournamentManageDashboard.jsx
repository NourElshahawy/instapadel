"use client";
import { useState } from "react";
import { generateBracket, advanceWinner } from "@/services/tournamentLogic";
import StartTournamentButton from "./StartTournamentButton";
import TeamsManageList from "./TeamsManageList";
import MatchScoreForm from "./MatchScoreForm";
import "@/styles/pages/tournament-manage.css";

export default function TournamentManageDashboard({ tournament: initialTournament }) {
  const [tournament, setTournament] = useState(initialTournament);

  const handleStart = async () => {
    // TODO: يتبعت للباك إند PATCH /api/tournaments/:id/start بنفس الـ payload ده
    const { rounds, matches } = generateBracket(tournament.teams);
    setTournament((t) => ({ ...t, rounds, matches, status: "ready" }));
  };

  const handleScoreSubmit = async (matchId, scoreA, scoreB) => {
    // TODO: يتبعت للباك إند POST /api/tournaments/:id/matches/:matchId/result
    setTournament((t) => advanceWinner(t, matchId, scoreA, scoreB));
  };

  const roundsInOrder = [...new Set(tournament.matches.map((m) => m.round))];

  return (
    <div className="manage-page" dir="rtl">
      <h1 style={{ color: "var(--white)", marginBottom: 24 }}>إدارة {tournament.name}</h1>

      <TeamsManageList teams={tournament.teams} />

      {tournament.status === "registration" && <StartTournamentButton tournament={tournament} onStart={handleStart} />}

      {tournament.matches.length > 0 && (
        <div className="manage-section">
          <h3>🎾 المباريات</h3>
          {roundsInOrder.map((round) => (
            <div key={round} style={{ marginBottom: 20 }}>
              <p style={{ color: "var(--text-faint)", fontSize: ".8rem", marginBottom: 10 }}>{round}</p>
              {tournament.matches
                .filter((m) => m.round === round)
                .map((m) => (
                  <MatchScoreForm key={m.id} match={m} onSubmit={handleScoreSubmit} />
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
