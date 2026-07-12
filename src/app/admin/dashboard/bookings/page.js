import { getAllBookingsForAdmin } from "@/services/adminBookingsService";
import AdminBookingsTable from "@/components/admin-dashboard/AdminBookingsTable";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookingsForAdmin();

  return (
    <>
      <h1 className="owner-page-title">كل الحجوزات ({bookings.length})</h1>
      <div className="owner-card">
        <AdminBookingsTable bookings={bookings} />
      </div>
    </>
  );
}
