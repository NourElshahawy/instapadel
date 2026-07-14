"use client";
import { useState } from "react";
import { addCourtToVenue } from "@/services/ownerVenuesClient";

export default function AddCourtForm({ venueId, onAdded }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("regular");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newCourt = await addCourtToVenue(venueId, { name, type, price });
      onAdded(newCourt);
      setOpen(false);
      setName(""); setType("regular"); setPrice("");
    } catch {
      alert("حصل خطأ أثناء إضافة الملعب");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="owner-court-edit-btn" onClick={() => setOpen(true)} style={{ marginTop: 10 }}>
        + أضف ملعب فرعي هنا
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, padding: 12, background: "var(--bg-secondary)", borderRadius: "var(--r-sm)" }}>
      <div className="row g-2">
        <div className="col-12">
          <input className="field-input" placeholder="اسم الملعب" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="col-6">
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="regular">عادي</option>
            <option value="panoramic">بانوراما</option>
            <option value="indoor">مغطى</option>
            <option value="outdoor">مكشوف</option>
          </select>
        </div>
        <div className="col-6">
          <input className="field-input" type="number" placeholder="السعر/ساعة" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="submit" className="owner-btn-save" disabled={submitting}>{submitting ? "جاري الإضافة…" : "إضافة"}</button>
        <button type="button" className="owner-btn-cancel" onClick={() => setOpen(false)}>إلغاء</button>
      </div>
    </form>
  );
}