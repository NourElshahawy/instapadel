"use client";
import { useState } from "react";
import Link from "next/link";

const DOW_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربع", "الخميس", "الجمعة", "السبت"];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? "ص" : "م";
  return `${h}:00 ${period}`;
});

export default function StaffList({ staff: initialStaff, venues }) {
  const [staff, setStaff] = useState(initialStaff);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", venueId: venues[0]?.id || "" });
  const [shifts, setShifts] = useState([{ day: "الأحد", start: "3:00 م", end: "11:00 م" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addShiftRow = () => setShifts((prev) => [...prev, { day: "الأحد", start: "3:00 م", end: "11:00 م" }]);
  const removeShiftRow = (i) => setShifts((prev) => prev.filter((_, idx) => idx !== i));
  const updateShiftRow = (i, field, value) => setShifts((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/staff/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, shiftSchedule: shifts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حصل خطأ");

      const venue = venues.find((v) => v.id === form.venueId);
      setStaff((prev) => [{ id: data.id, name: form.name, phone: form.phone, venueName: venue?.name || "—", weeklyHours: shifts.reduce((s, x) => s, 0), shiftsCount: shifts.length }, ...prev]);
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", password: "", venueId: venues[0]?.id || "" });
      setShifts([{ day: "الأحد", start: "3:00 م", end: "11:00 م" }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="owner-btn-save" onClick={() => setShowForm((s) => !s)}>
          <i className="fa-solid fa-user-plus"></i> إضافة موظف
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="owner-card" style={{ marginBottom: 20 }}>
          <h2 className="owner-card-title">موظف جديد</h2>

          {error && <p style={{ color: "#ff6b6b", fontSize: ".85rem", marginBottom: 10 }}>{error}</p>}

          <div className="field-group">
            <label>الاسم</label>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field-group">
            <label>الإيميل</label>
            <input type="email" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field-group">
            <label>رقم الهاتف</label>
            <input className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field-group">
            <label>باسورد مؤقت</label>
            <input type="text" className="field-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="field-group">
            <label>الملعب</label>
            <select className="field-input" value={form.venueId} onChange={(e) => setForm({ ...form, venueId: e.target.value })} required>
              <option value="all">كل الملاعب</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>مواعيد الشيفت</label>
            {shifts.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <select className="field-input" value={s.day} onChange={(e) => updateShiftRow(i, "day", e.target.value)}>
                  {DOW_NAMES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select className="field-input" value={s.start} onChange={(e) => updateShiftRow(i, "start", e.target.value)}>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span>الي</span>
                <select className="field-input" value={s.end} onChange={(e) => updateShiftRow(i, "end", e.target.value)}>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {shifts.length > 1 && (
                  <button type="button" onClick={() => removeShiftRow(i)} className="owner-btn-cancel-booking" style={{ padding: "6px 10px" }}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addShiftRow} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: ".85rem" }}>
              + ضيف يوم تاني
            </button>
          </div>

          <button type="submit" className="owner-btn-save" disabled={saving} style={{ marginTop: 10 }}>
            {saving ? "جاري الإضافة..." : "إضافة الموظف"}
          </button>
        </form>
      )}

      {staff.length === 0 ? (
        <p className="owner-table-empty">لسه معندكش موظفين مضافين.</p>
      ) : (
        <div className="owner-card">
          {staff.map((s) => (
            <Link key={s.id} href={`/owner/dashboard/staff/${s.id}`} className="owner-venue-row" style={{ textDecoration: "none" }}>
              <div>
                <span className="owner-venue-row-name">{s.name}</span>
                <div style={{ fontSize: ".76rem", color: "#94a3b8" }}>
                  {s.venueName} · {s.phone || "—"}
                </div>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: ".82rem" }}>{s.shiftsCount} شيفت / أسبوع</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
