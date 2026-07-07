import { createClient } from "@/lib/supabase/server";
import { getOwnerOverview } from "@/services/ownerDashboardService";
import RevenueChart from "@/components/owner-dashboard/RevenueChart";

export default async function OwnerOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const stats = await getOwnerOverview(user.id);

  return (
    <>
      <h1 className="owner-page-title">نظرة عامة</h1>

      <div className="owner-stats-grid">
        <StatCard label="إجمالي الإيرادات" value={`${stats.totalRevenue} ج.م`} />
        <StatCard label="عدد الحجوزات" value={stats.totalBookings} />
        <StatCard label="عدد الملاعب" value={stats.totalCourts} />
        <StatCard label="أماكنك" value={stats.totalVenues} />
      </div>

      <div className="owner-card">
        <h2 className="owner-card-title">الإيرادات آخر 7 أيام</h2>
        <RevenueChart data={stats.revenueByDay} />
      </div>

      <div className="owner-card">
        <h2 className="owner-card-title">أماكنك</h2>
        {stats.venues.map((v) => (
          <div key={v.id} className="owner-venue-row">
            <span className="owner-venue-row-name">{v.name}</span>
            <span className={`owner-status-badge ${v.status}`}>{v.status === "approved" ? "معتمد" : "قيد المراجعة"}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="owner-stat-card">
      <p className="owner-stat-label">{label}</p>
      <p className="owner-stat-value">{value}</p>
    </div>
  );
}
