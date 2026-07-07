import { createClient } from "@/lib/supabase/server";
import { getOwnerOverview } from "@/services/ownerDashboardService";
import RevenueChart from "@/components/owner-dashboard/RevenueChart";

export default async function OwnerOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const stats = await getOwnerOverview(user.id);

  return (
    <div className="tw-max-w-6xl tw-mx-auto" dir="rtl">
      <h1 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-6">نظرة عامة</h1>

      <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-8">
        <StatCard label="إجمالي الإيرادات" value={`${stats.totalRevenue} ج.م`} />
        <StatCard label="عدد الحجوزات" value={stats.totalBookings} />
        <StatCard label="عدد الملاعب" value={stats.totalCourts} />
        <StatCard label="أماكنك" value={stats.totalVenues} />
      </div>

      <div className="tw-bg-slate-900 tw-border tw-border-slate-800 tw-rounded-xl tw-p-5 tw-mb-8">
        <h2 className="tw-text-white tw-font-semibold tw-mb-4">الإيرادات آخر 7 أيام</h2>
        <RevenueChart data={stats.revenueByDay} />
      </div>

      <div className="tw-bg-slate-900 tw-border tw-border-slate-800 tw-rounded-xl tw-p-5">
        <h2 className="tw-text-white tw-font-semibold tw-mb-4">أماكنك</h2>
        <div className="tw-flex tw-flex-col tw-gap-2">
          {stats.venues.map((v) => (
            <div key={v.id} className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-border-b tw-border-slate-800 last:tw-border-0">
              <span className="tw-text-white tw-text-sm">{v.name}</span>
              <span className={`tw-text-xs tw-px-2 tw-py-1 tw-rounded-full ${v.status === "approved" ? "tw-bg-emerald-500/10 tw-text-emerald-400" : "tw-bg-amber-500/10 tw-text-amber-400"}`}>
                {v.status === "approved" ? "معتمد" : "قيد المراجعة"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="tw-bg-slate-900 tw-border tw-border-slate-800 tw-rounded-xl tw-p-4">
      <p className="tw-text-slate-400 tw-text-xs tw-mb-1">{label}</p>
      <p className="tw-text-white tw-text-xl tw-font-bold">{value}</p>
    </div>
  );
}