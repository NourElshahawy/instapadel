import Link from "next/link";

const STATUS_LABELS = { registration: "التسجيل مفتوح", ready: "جاهزة", live: "جارية", completed: "انتهت" };

export default function AdminTournamentsList({ tournaments }) {
  if (tournaments.length === 0) return <p className="owner-table-empty">مفيش بطولات لسه.</p>;

  return (
    <>
      {tournaments.map((t) => (
        <div key={t.id} className="admin-venue-card">
          <div className="admin-venue-head">
            <div>
              <p className="admin-venue-name">{t.name}</p>
              <p className="admin-venue-owner">منظّم بواسطة: {t.organizerName}</p>
            </div>
            <span className={`owner-status-badge ${t.status === "completed" ? "approved" : "pending"}`}>{STATUS_LABELS[t.status]}</span>
          </div>

          <div className="admin-venue-meta">
            <span>📍 {t.venue}</span>
            <span>🗓 {new Date(t.date).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}</span>
            <span>
              👥 {t.teamsCount} / {t.maxTeams} فرق
            </span>
            {t.champion && <span>🏆 البطل: {t.champion}</span>}
          </div>

          <Link href={`/tournaments/${t.id}`} className="admin-btn-approve" style={{ display: "inline-block", textDecoration: "none" }}>
            عرض البطولة
          </Link>
        </div>
      ))}
    </>
  );
}
