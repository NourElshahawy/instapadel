"use client";
import { useState } from "react";
import { submitAdminNews, respondToOwnerNews } from "@/services/adminNewsClient";

const CATEGORIES = [
  { value: "announcement", label: "إعلان" },
  { value: "tournament", label: "بطولة" },
  { value: "partnership", label: "شراكة" },
  { value: "maintenance", label: "صيانة" },
];

export default function AdminNewsManager({ authorId, pendingNews: initialPending }) {
  const [pendingNews, setPendingNews] = useState(initialPending);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("announcement");
  const [posting, setPosting] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await submitAdminNews(authorId, title, body, category);
      setTitle("");
      setBody("");
      alert("تم النشر");
    } catch {
      alert("حصل خطأ");
    } finally {
      setPosting(false);
    }
  };

  const handleRespond = async (id, approve) => {
    await respondToOwnerNews(id, approve);
    setPendingNews((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <form onSubmit={handlePost} className="owner-card">
        <h2 className="owner-card-title">نشر خبر عام (زي: للبيع مضرب بادل)</h2>
        <div className="field-group">
          <label>العنوان</label>
          <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field-group">
          <label>التفاصيل</label>
          <textarea className="field-input field-textarea" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="field-group">
          <label>التصنيف</label>
          <select className="field-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="admin-btn-approve" disabled={posting}>
          {posting ? "جاري النشر…" : "نشر"}
        </button>
      </form>

      <div className="owner-card">
        <h2 className="owner-card-title">أخبار الأونرز — قيد المراجعة ({pendingNews.length})</h2>
        {pendingNews.length === 0 ? (
          <p className="owner-table-empty">مفيش أخبار محتاجة موافقة.</p>
        ) : (
          pendingNews.map((n) => (
            <div key={n.id} className="admin-venue-card">
              <p className="admin-venue-name">{n.title}</p>
              <p className="admin-venue-meta" style={{ marginTop: 6 }}>
                {n.body}
              </p>
              <div className="admin-venue-actions" style={{ marginTop: 10 }}>
                <button className="admin-btn-approve" onClick={() => handleRespond(n.id, true)}>
                  ✓ موافقة
                </button>
                <button className="admin-btn-reject" onClick={() => handleRespond(n.id, false)}>
                  ✕ رفض
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
