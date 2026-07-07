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
      setLocalVenues((prev) =>
        prev.map((v) =>
          v.id === venueId
            ? { ...v, courts: v.courts.map((c) => (c.id === courtId ? { ...c, price_per_hour: Number(tempPrice) } : c)) }
            : v
        )
      );
      setEditingId(null);
    } catch {
      alert("حصل خطأ أثناء تحديث السعر");
    } finally {
      setSaving(false);
    }
  };

  if (localVenues.length === 0) {
    return <p className="tw-text-slate-400 tw-text-sm">مفيش ملاعب مسجلة بعد.</p>;
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-6">
      {localVenues.map((venue) => (
        <div key={venue.id} className="tw-bg-slate-900 tw-border tw-border-slate-800 tw-rounded-xl tw-p-5">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
            <h2 className="tw-text-white tw-font-semibold">{venue.name}</h2>
            <span className={`tw-text-xs tw-px-2 tw-py-1 tw-rounded-full ${venue.status === "approved" ? "tw-bg-emerald-500/10 tw-text-emerald-400" : "tw-bg-amber-500/10 tw-text-amber-400"}`}>
              {venue.status === "approved" ? "معتمد" : "قيد المراجعة"}
            </span>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-2">
            {venue.courts.map((court) => (
              <div key={court.id} className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-border-b tw-border-slate-800 last:tw-border-0">
                <span className="tw-text-slate-300 tw-text-sm">{court.name}</span>

                {editingId === court.id ? (
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="tw-w-20 tw-bg-slate-800 tw-border tw-border-slate-700 tw-rounded tw-px-2 tw-py-1 tw-text-white tw-text-sm"
                    />
                    <button onClick={() => handleSave(venue.id, court.id)} disabled={saving} className="tw-text-xs tw-bg-emerald-500 tw-text-slate-950 tw-px-2 tw-py-1 tw-rounded tw-font-semibold">
                      حفظ
                    </button>
                    <button onClick={() => setEditingId(null)} className="tw-text-xs tw-text-slate-400 tw-px-2 tw-py-1">
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <span className="tw-text-emerald-400 tw-font-semibold tw-text-sm">{court.price_per_hour} ج.م/ساعة</span>
                    <button onClick={() => startEdit(court)} className="tw-text-xs tw-text-slate-400 hover:tw-text-white">
                      تعديل
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}