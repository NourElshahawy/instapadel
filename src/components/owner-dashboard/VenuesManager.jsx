"use client";
import { useState } from "react";
import { updateCourtPrice } from "@/services/ownerVenuesClient";

export default function VenuesManager({ venues }) {
  const [editingId, setEditingId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [localVenues, setLocalVenues] = useState(venues);

  const startEdit = (court) => {
    setEditingId(court.id);
    setTempPrice(String(court.price_per_hour));
  };

  const handleSave = async (venueId, courtId) => {
    setSaving(true);
    try {
      await updateCourtPrice(courtId, Number(tempPrice));
      setLocalVenues((prev) => prev.map((v) => (v.id === venueId ? { ...v, courts: v.courts.map((c) => (c.id === courtId ? { ...c, price_per_hour: Number(tempPrice) } : c)) } : v)));
      setEditingId(null);
    } catch {
      alert("حصل خطأ أثناء تحديث السعر");
    } finally {
      setSaving(false);
    }
  };

  if (localVenues.length === 0) return <p className="owner-table-empty">مفيش ملاعب مسجلة بعد.</p>;

  return (
    <>
      {localVenues.map((venue) => (
        <div key={venue.id} className="owner-venue-block">
          <div className="owner-venue-block-header">
            <span className="owner-venue-row-name" style={{ fontWeight: 700 }}>
              {venue.name}
            </span>
            <span className={`owner-status-badge ${venue.status}`}>{venue.status === "approved" ? "معتمد" : "قيد المراجعة"}</span>
          </div>

          {venue.courts.map((court) => (
            <div key={court.id} className="owner-court-row">
              <span className="owner-court-name">{court.name}</span>

              {editingId === court.id ? (
                <div className="owner-court-edit-group">
                  <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} className="owner-court-edit-input" />
                  <button onClick={() => handleSave(venue.id, court.id)} disabled={saving} className="owner-btn-save">
                    حفظ
                  </button>
                  <button onClick={() => setEditingId(null)} className="owner-btn-cancel">
                    إلغاء
                  </button>
                </div>
              ) : (
                <div className="owner-court-edit-group">
                  <span className="owner-court-price">{court.price_per_hour} ج.م/ساعة</span>
                  <button onClick={() => startEdit(court)} className="owner-court-edit-btn">
                    تعديل
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
