import { getAllTournamentsForAdmin } from "@/services/adminTournamentsService";
import AdminTournamentsList from "@/components/admin-dashboard/AdminTournamentsList";

export default async function AdminTournamentsPage() {
  const tournaments = await getAllTournamentsForAdmin();

  return (
    <>
      <h1 className="owner-page-title"> عرض البطولات </h1>
      <AdminTournamentsList tournaments={tournaments} />
    </>
  );
}
