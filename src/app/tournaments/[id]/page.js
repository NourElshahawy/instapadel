import TournamentDashboard from "@/components/tournaments/dashboard/TournamentDashboard";
import { getTournamentById } from "@/services/tournamentService";
import { getCurrentUser } from "@/services/authService";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const tournament = await getTournamentById(id);
  return { title: tournament ? `${tournament.name} — InstaPadel` : "بطولة غير موجودة — InstaPadel" };
}

export default async function TournamentPage({ params }) {
  const { id } = await params;
  const tournament = await getTournamentById(id);
  if (!tournament) notFound();

  const user = await getCurrentUser();

  async function handleJoin(teamData) {
    "use server";
    // TODO: POST /api/tournaments/[id]/join بالـ teamData
  }

  return (
    <TournamentDashboard
      tournament={tournament}
      currentUser={{
        id: user?.id,
        isOrganizer: tournament.organizerId === user?.id, // مش isOwner — منظم مش لازم يملك ملعب
        isRegistered: tournament.teams?.some((t) => t.captainId === user?.id),
      }}
      onJoin={handleJoin}
      onManage={`/tournaments/${id}/manage`}
      onCreateNew="/tournaments/create"
    />
  );
}
