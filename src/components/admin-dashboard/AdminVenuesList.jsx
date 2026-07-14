"use client";
import { useMemo, useState } from "react";
import { updateVenueStatus } from "@/services/adminVenuesClient";

const TABS = [
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "معتمدة" },
  { key: "rejected", label: "مرفوضة" },
  { key: "all", label: "الكل" },
];

export default function AdminVenuesList({ venues: initialVenues }) {
  const [venues, setVenues] = useState(initialVenues);
  const [tab, setTab] = useState("pending");
  const [loadingId, setLoadingId] = useState(null);

  const filtered = useMemo(() => {
    if (tab === "all") return venues;
    return venues.filter((v) => v.status === tab);
  }, [venues, tab]);

  const handleUpdate = async (venueId, status) => {
    setLoadingId(venueId);
    try {
      await updateVenueStatus(venueId, status);
      setVenues((prev) => prev.map((v) => (v.id === venueId ? { ...v, status } : v)));
    } catch {
      alert("حصل خطأ أثناء تحديث حالة الملعب");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="admin-filter-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`admin-filter-tab ${tab === t.key ? "is-active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label} ({t.key === "all" ? venues.length : venues.filter((v) => v.status === t.key).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="owner-table-empty">مفيش ملاعب في القسم ده.</p>
      ) : (
        filtered.map((v) => (
          <div key={v.id} className="admin-venue-card">
            <div className="admin-venue-head">
              <div>
                <p className="admin-venue-name">{v.name}</p>
                <p className="admin-venue-owner">
                  مالك: {v.owner?.name || "—"} · {v.owner?.phone || "—"}
                </p>
              </div>
              <span className={`owner-status-badge ${v.status === "approved" ? "approved" : "pending"}`}>{v.status === "approved" ? "معتمد" : v.status === "rejected" ? "مرفوض" : "قيد المراجعة"}</span>
            </div>

            <div className="admin-venue-meta">
              <span>📍 {v.address || "—"}</span>
              <span>📞 {v.phone || "—"} · ✉️ {v.email || "—"}</span>
            </div>

            <p className="admin-venue-courts">
              {v.courts?.length || 0} ملعب: {v.courts?.map((c) => `${c.name} (${c.price_per_hour} ج.م)`).join("، ") || "—"}
            </p>

            {v.status !== "approved" && (
              <div className="admin-venue-actions">
                <button className="admin-btn-approve" onClick={() => handleUpdate(v.id, "approved")} disabled={loadingId === v.id}>
                  {loadingId === v.id ? "جاري..." : "✓ قبول"}
                </button>
                <button className="admin-btn-reject" onClick={() => handleUpdate(v.id, "rejected")} disabled={loadingId === v.id}>
                  ✕ رفض
                </button>
              </div>
            )}
            {v.status === "approved" && (
              <div className="admin-venue-actions">
                <button className="admin-btn-reject" onClick={() => handleUpdate(v.id, "rejected")} disabled={loadingId === v.id}>
                  إلغاء الاعتماد
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
