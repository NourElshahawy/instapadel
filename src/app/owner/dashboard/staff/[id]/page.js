import { createClient } from "@/lib/supabase/server";
import { getStaffDetail } from "@/services/staffService";
import { notFound } from "next/navigation";

export default async function StaffDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const staff = await getStaffDetail(id, user.id);
  if (!staff) notFound();

  return (
    <>
      <h1 className="owner-page-title">{staff.name}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        {staff.venueName} · {staff.phone || "—"}
      </p>

      <div className="owner-stats-grid">
        <div className="owner-stat-card">
          <p className="owner-stat-label">ساعات العمل الأسبوعية</p>
          <p className="owner-stat-value">{staff.weeklyHours}</p>
        </div>
        <div className="owner-stat-card">
          <p className="owner-stat-label">حجوزات في الشيفت</p>
          <p className="owner-stat-value">{staff.bookingsInShift}</p>
        </div>
        <div className="owner-stat-card">
          <p className="owner-stat-label">إلغاءات في الشيفت</p>
          <p className="owner-stat-value">{staff.cancellationsInShift}</p>
        </div>
      </div>

      <div className="owner-card">
        <h2 className="owner-card-title">مواعيد الشيفت</h2>
        {staff.shiftSchedule.length === 0 ? (
          <p className="owner-table-empty">مفيش مواعيد شيفت متسجلة.</p>
        ) : (
          staff.shiftSchedule.map((s, i) => (
            <div key={i} className="owner-venue-row">
              <span className="owner-venue-row-name">{s.day}</span>
              <span style={{ color: "var(--text-muted)" }}>
                {s.start} الي {s.end}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
