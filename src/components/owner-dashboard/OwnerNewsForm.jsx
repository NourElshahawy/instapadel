"use client";
import { useState } from "react";
import { submitOwnerNews } from "@/services/ownerNewsClient";

export default function OwnerNewsForm({ authorId }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitOwnerNews(authorId, title, body);
      setStatus("sent");
      setTitle("");
      setBody("");
    } catch {
      alert("حصل خطأ أثناء إرسال الخبر");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="owner-card">
        <p style={{ color: "var(--accent)", fontSize: ".9rem" }}>✓ تم إرسال الخبر، هيظهر للعامة بعد موافقة الإدارة.</p>
        <button className="owner-btn-save" onClick={() => setStatus("idle")} style={{ marginTop: 10 }}>
          إرسال خبر تاني
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="owner-card">
      <h2 className="owner-card-title">نشر خبر / إعلان</h2>
      <div className="field-group">
        <label>عنوان الخبر</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: ملعبي هيقفل النهاردة" required />
      </div>
      <div className="field-group">
        <label>التفاصيل</label>
        <textarea className="field-input field-textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="تفاصيل إضافية..." />
      </div>
      <button type="submit" className="owner-btn-save" disabled={status === "loading"}>
        {status === "loading" ? "جاري الإرسال…" : "إرسال للمراجعة"}
      </button>
    </form>
  );
}
