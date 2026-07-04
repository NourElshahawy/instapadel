"use client";
import { useState } from "react";

export default function JoinTeamSheet({ tournament, onClose, onSubmit }) {
  const [form, setForm] = useState({ captainName: "", captainPhone: "", partnerName: "" });
  const [submitting, setSubmitting] = useState(false);

  const isDouble = tournament.type === "double";
  const canSubmit = form.captainName.trim() && form.captainPhone.trim() && (!isDouble || form.partnerName.trim());

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div className="confirm-sheet active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet-content">
        <div className="sheet-handle" />
        <h2>الاشتراك في {tournament.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>اسم الكابتن</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-user field-icon"></i>
              <input className="field-input" value={form.captainName} onChange={(e) => update({ captainName: e.target.value })} placeholder="اسمك الكامل" required />
            </div>
          </div>

          <div className="field-group">
            <label>رقم الهاتف</label>
            <div className="field-input-wrap">
              <i className="fa-solid fa-phone field-icon"></i>
              <input className="field-input phone-rtl-fix" type="tel" value={form.captainPhone} onChange={(e) => update({ captainPhone: e.target.value })} placeholder="01xx xxx xxxx" required />
            </div>
          </div>

          {isDouble && (
            <div className="field-group">
              <label>اسم الشريك</label>
              <div className="field-input-wrap">
                <i className="fa-solid fa-user-plus field-icon"></i>
                <input className="field-input" value={form.partnerName} onChange={(e) => update({ partnerName: e.target.value })} placeholder="اسم شريكك في اللعب" required />
              </div>
            </div>
          )}

          <button type="submit" className="confirm-btn" disabled={!canSubmit || submitting}>
            {submitting ? "جاري التسجيل…" : "تأكيد الاشتراك"}
          </button>
          <button type="button" className="cancel-sheet-btn" onClick={onClose} disabled={submitting}>
            إلغاء
          </button>
        </form>
      </div>
    </div>
  );
}
