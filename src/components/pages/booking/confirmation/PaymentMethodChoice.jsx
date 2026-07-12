"use client";
import { useState } from "react";
import InstaPayBlock from "../../confirmation/InstaPayBlock";
// import InstaPayBlock from "./InstaPayBlock";

export default function PaymentMethodChoice({ amount, bookingId, isPaid, onMarkPaid }) {
  const [method, setMethod] = useState(null); // null | "instapay" | "onsite"

  if (isPaid) {
    return (
      <div className="paid-badge">
        <i className="fa-solid fa-circle-check"></i>
        تم إرسال الدفع — قيد المراجعة
      </div>
    );
  }

  if (method === "instapay") {
    return (
      <>
        <button className="payment-method-back" onClick={() => setMethod(null)}>
          ← رجوع لاختيار طريقة الدفع
        </button>
        <InstaPayBlock amount={amount} bookingId={bookingId} isPaid={isPaid} onMarkPaid={onMarkPaid} />
      </>
    );
  }

  if (method === "onsite") {
    return (
      <div className="onsite-payment-block">
        <i className="fa-solid fa-store" style={{ fontSize: 32, color: "var(--accent)" }}></i>
        <p style={{ color: "var(--white)", fontWeight: 700, marginTop: 10 }}>الدفع في الملعب</p>
        <p style={{ color: "var(--text-muted)", fontSize: ".86rem", marginTop: 6 }}>
          هتدفع <b style={{ color: "var(--accent)" }}>{amount} ج.م</b> نقدًا أو بالكارت مباشرة في الملعب وقت الحضور.
        </p>
        <button className="payment-method-back" onClick={() => setMethod(null)} style={{ marginTop: 12 }}>
          ← تغيير طريقة الدفع
        </button>
      </div>
    );
  }

  return (
    <div className="payment-method-choice">
      <p style={{ color: "var(--text-muted)", fontSize: ".86rem", marginBottom: 14 }}>اختر طريقة الدفع المناسبة لك</p>
      <div className="payment-method-options">
        <button className="payment-method-card" onClick={() => setMethod("onsite")}>
          <i className="fa-solid fa-store"></i>
          <span>الدفع في الملعب</span>
        </button>
        <button className="payment-method-card" onClick={() => setMethod("instapay")}>
          <i className="fa-solid fa-mobile-screen-button"></i>
          <span>InstaPay</span>
        </button>
      </div>
    </div>
  );
}
