import { getAllVenuesForAdmin } from "@/services/adminVenuesService";
import AdminVenuesList from "@/components/admin-dashboard/AdminVenuesList";

export default async function AdminVenuesPage() {
  const venues = await getAllVenuesForAdmin();

  return (
    <>
      <h1 className="owner-page-title">موافقة الملاعب</h1>
      <AdminVenuesList venues={venues} />
    </>
  );
}
