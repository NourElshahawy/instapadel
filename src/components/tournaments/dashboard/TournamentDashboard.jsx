"use client";

import { useMemo } from "react";
import Hero from "./Hero";
import Countdown from "./Countdown";
import RegistrationProgress from "./RegistrationProgress";
import TeamsGrid from "./TeamsGrid";
import StatusTimeline from "./StatusTimeline";
import MatchesList from "./MatchesList";
import Bracket from "./Bracket";
import StatsGrid from "./StatsGrid";
import NewsFeed from "./NewsFeed";
import FloatingActionButton from "./FloatingActionButton";
import "@/styles/pages/tournament-dashboard.css";

/**
 * الشكل المتوقع لـ tournament القادم من الـ backend:
 * {
 *   id, name, status: "registration" | "ready" | "live" | "completed",
 *   date, venue, maxTeams,
 *   teams: [{ id, name, captainName, rating, status: "confirmed" | "pending" }],
 *   matches: [{ id, round, teamA, teamB, scoreA, scoreB, time, isLive, isDone }],
 *   rounds: ["Round 1", "Quarter Final", "Semi Final", "Final"],
 *   timeline: [{ label, done, active }],
 *   news: [{ id, text, date }],
 *   champion: { teamName } | null,
 *   topThree: [{ rank, teamName }],
 *   gallery: [url],
 *   startsAt, firstMatchAt
 * }
 */

function resolveStage(tournament) {
  if (tournament.status === "completed") return "completed";
  if (tournament.status === "live") return "live";
  if (tournament.status === "ready") return "ready";
  if (tournament.teams?.length >= tournament.maxTeams) return "ready";
  return "registration";
}

export default function TournamentDashboard({ tournament, currentUser = {}, onJoin, onManage, onCreateNew }) {
  const stage = useMemo(() => resolveStage(tournament), [tournament]);

  const fab = useMemo(() => {
    if (stage === "completed") return { label: "أنشئ بطولة جديدة", action: onCreateNew, tone: "gold" };
    if (currentUser.isOwner) return { label: "إدارة البطولة", action: onManage, tone: "court" };
    if (currentUser.isRegistered) return { label: "أنت مشترك بالفعل", action: null, tone: "muted" };
    if (stage === "registration") return { label: "اشترك الآن", action: onJoin, tone: "court" };
    return null;
  }, [stage, currentUser, onJoin, onManage, onCreateNew]);

  const handleJoin = async () => {
    await fetch("/api/tournaments/" + tournament.id + "/join", {
      method: "POST",
    });

    router.refresh();
  };
  
  return (
    <div className={`td-page td-page--${stage}`} dir="rtl">
      <Hero tournament={tournament} stage={stage} />

      {stage === "registration" && (
        <>
          <RegistrationProgress current={tournament.teams?.length ?? 0} max={tournament.maxTeams} />
          {tournament.startsAt && <Countdown target={tournament.startsAt} label="يبدأ بعد" />}
          <TeamsGrid teams={tournament.teams} />
        </>
      )}

      {stage === "ready" && (
        <>
          {tournament.firstMatchAt && <Countdown target={tournament.firstMatchAt} label="أول مباراة بعد" />}
          <Bracket rounds={tournament.rounds} matches={tournament.matches} />
          <MatchesList matches={tournament.matches} stage={stage} />
        </>
      )}

      {stage === "live" && (
        <>
          <MatchesList matches={tournament.matches} stage={stage} />
          <Bracket rounds={tournament.rounds} matches={tournament.matches} />
        </>
      )}

      {stage === "completed" && (
        <>
          <MatchesList matches={tournament.matches} stage={stage} />
          {tournament.gallery?.length > 0 && (
            <section className="td-gallery">
              <h3 className="td-section-title">📸 صور البطولة</h3>
              <div className="td-gallery-grid">
                {tournament.gallery.map((src, i) => (
                  <img key={i} src={src} alt="" className="td-gallery-img" />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {stage !== "completed" && <StatusTimeline steps={tournament.timeline} />}
      <StatsGrid tournament={tournament} />
      {tournament.news?.length > 0 && <NewsFeed items={tournament.news} />}

      {fab && <FloatingActionButton label={fab.label} onClick={fab.action} tone={fab.tone} disabled={!fab.action} />}
    </div>
  );
}
