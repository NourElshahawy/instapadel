import Link from "next/link";
import { getAdminOverview } from "@/services/adminOverviewService";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverview();

  return (
    <>
      <h1 className="owner-page-title">نظرة عامة على النظام</h1>

      <div className="owner-stats-grid">
        <StatCard label="إجمالي المستخدمين" value={stats.usersCount} />
        <StatCard label="الملاعب المعتمدة" value={stats.venuesCount} />
        <StatCard label="ملاعب قيد المراجعة" value={stats.pendingVenuesCount} highlight={stats.pendingVenuesCount > 0} />
        <StatCard label="إجمالي الحجوزات" value={stats.bookingsCount} />
        <StatCard label="البطولات" value={stats.tournamentsCount} />
        <StatCard label="إجمالي الإيرادات" value={`${stats.totalRevenue} ج.م`} />
      </div>

      {stats.pendingVenuesCount > 0 && (
        <div className="owner-card" style={{ borderColor: "#ffc453" }}>
          <p style={{ color: "#ffc453", fontSize: ".9rem", marginBottom: 10 }}>⚠️ عندك {stats.pendingVenuesCount} ملعب مستني موافقتك</p>
          <Link href="/admin/dashboard/venues" className="admin-btn-approve" style={{ display: "inline-block", textDecoration: "none" }}>
            راجع الملاعب الآن
          </Link>
        </div>
      )}
    </>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="owner-stat-card" style={highlight ? { borderColor: "#ffc453" } : {}}>
      <p className="owner-stat-label">{label}</p>
      <p className="owner-stat-value" style={highlight ? { color: "#ffc453" } : {}}>
        {value}
      </p>
    </div>
  );
}
