
import TournamentDashboard from "@/components/tournaments/dashboard/TournamentDashboard";
import { getTournamentById } from "@/services/tournamentService";
// import { getCurrentUser } from "@/services/authService";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const tournament = await getTournamentById(params.id);
  if (!tournament) return {
      title: tournament ? `${tournament.name} — InstaPadel` : "بطولة غير موجودة — InstaPadel",
    };
}

export default async function TournamentPage({ params }) {
  const tournament = await getTournamentById(params.id);
  if (!tournament) return notFound();

  // const user = await getCurrentUser();

  // الحالة بتتحدد من الـ backend (status: registration | ready | live | completed)
  // لو عايز fallback محلي لو الـ backend لسه ما حدثش الحالة:
  // const status = tournament.teams.length >= tournament.maxTeams && tournament.status === "registration"
  //   ? "ready"
  //   : tournament.status;

  // async function handleJoin() {
  //   "use server";
  //   // POST /api/tournaments/[id]/join
  //   // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/tournaments/${params.id}/join`, { method: "POST" });
  // }

  async function handleManage() {
    "use server";
    // redirect(`/tournaments/${params.id}/manage`);
  }

  async function handleCreateNew() {
    "use server";
    // redirect(`/tournaments/create`);
  }

  return (
    <TournamentDashboard
      tournament={tournament}
      currentUser={{
        isOwner: tournament.ownerId === user?.id,
        isRegistered: tournament.teams?.some((t) => t.captainId === user?.id),
      }}
      onJoin={handleJoin}
      onManage={handleManage}
      onCreateNew={handleCreateNew}
    />
  );
}
