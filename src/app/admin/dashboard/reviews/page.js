import { getAllReviewsForAdmin } from "@/services/adminReviewsService";
import AdminReviewsTable from "@/components/admin-dashboard/AdminReviewsTable";
import AdminPagination from "@/components/admin-dashboard/AdminPagination";

export default async function AdminReviewsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const { reviews, totalCount, totalPages } = await getAllReviewsForAdmin(page);

  return (
    <>
      <h1 className="owner-page-title">التقييمات ({totalCount})</h1>
      <div className="owner-card">
        <AdminReviewsTable reviews={reviews} />
        <AdminPagination currentPage={page} totalPages={totalPages} />
      </div>
    </>
  );
}
