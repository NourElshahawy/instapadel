import { getAllBookingsForAdmin } from "@/services/adminBookingsService";
import AdminBookingsTable from "@/components/admin-dashboard/AdminBookingsTable";
import Pagination from "@/components/shared/Pagination";

export default async function AdminBookingsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const { bookings, totalCount, totalPages } = await getAllBookingsForAdmin(page);

  return (
    <>
      <h1 className="owner-page-title">كل الحجوزات ({totalCount})</h1>
      <div className="owner-card">
        <AdminBookingsTable bookings={bookings} />
        {/* Pagination هنا هتحتاج تبقى Client Component بتستخدم Link مع ?page= بدل useState لأن الصفحة server-rendered */}
      </div>
    </>
  );
}