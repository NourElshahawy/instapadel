"use client";
import { useState } from "react";
import "../../styles/shared/owner-modal.css";
export default function OwnerModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  if (!isOpen) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: هتتوصل بـ endpoint حقيقي لطلبات أصحاب الملاعب
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        onClose();
        setForm({ name: "", phone: "", email: "" });
        setStatus("idle");
      }, 1200);
    }, 1000);
  };

  return (
    <div className="modal-backdrop-ph show" onClick={onClose}>
      <div className="modal-dialog-ph" onClick={(e) => e.stopPropagation()}>
        <div className="owner-modal-content">
          <button type="button" className="btn-close-ph" aria-label="إغلاق" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="owner-modal-body">
            <span className="icon-circle owner-modal-icon">
              <i className="fa-solid fa-shop"></i>
            </span>
            <span className="eyebrow">لأصحاب الملاعب</span>
            <h3 className="mt-2">املأ ساعاتك الفارغة. أدرج ملعبك على InstaPadel.</h3>
            <p className="owner-modal-sub">آلاف اللاعبين في المنصورة يبحثون عن ملعب الآن — اترك تفاصيلك وسيتصل بك فريقنا خلال 24 ساعة لإدراجك.</p>

            <form className="owner-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor="ownerName">اسمك</label>
                <div className="field-input-wrap">
                  <input className="field-input" type="text" id="ownerName" name="name" placeholder="الاسم الكامل" value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="ownerPhone">رقم الهاتف</label>
                <div className="field-input-wrap">
                  <input className="field-input" type="tel" id="ownerPhone" name="phone" placeholder="01xx xxx xxxx" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="ownerEmail">البريد الإلكتروني</label>
                <div className="field-input-wrap">
                  <input className="field-input" type="email" id="ownerEmail" name="email" placeholder="بريدك@مثال.كوم" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <button type="submit" className="btn btn-accent btn-block" disabled={status !== "idle"}>
                {status === "idle" && "اطلب معاودة الاتصال"}
                {status === "sending" && "جاري الإرسال…"}
                {status === "sent" && "تم الإرسال ✓"}
              </button>
            </form>

            <p className="owner-modal-note">
              <i className="fa-regular fa-clock"></i>
              نرد عادةً في غضون 24 ساعة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
