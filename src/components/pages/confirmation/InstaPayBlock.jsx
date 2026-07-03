"use client";
import { useEffect, useState } from "react";

const INSTAPAY_NUMBER = "01065801252";
const HOLD_MINUTES = 15;

export default function InstaPayBlock({ amount, bookingId, isPaid, onMarkPaid }) {
  const [secondsLeft, setSecondsLeft] = useState(HOLD_MINUTES * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isPaid) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [isPaid]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTAPAY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (isPaid) {
    return (
      <div className="paid-badge">
        <i className="fa-solid fa-circle-check"></i>
        تم إرسال الدفع — قيد المراجعة
      </div>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="instapay-block">
      <div className="instapay-amount">
        <span>المبلغ المستحق</span>
        <b>{amount} ج.م</b>
      </div>

      <div className="instapay-steps">
        <div className="instapay-step">
          <span className="instapay-num">1</span>
          <span>افتح تطبيق البنك أو InstaPay</span>
        </div>
        <div className="instapay-step">
          <span className="instapay-num">2</span>
          <span>
            أرسل <b>{amount} ج.م</b> إلى رقم InstaPay
          </span>
        </div>
        <div className="instapay-step">
          <span className="instapay-num">3</span>
          <span>
            استخدم معرف الحجز <b>{bookingId}</b> كملاحظة التحويل
          </span>
        </div>
      </div>

      <div className="instapay-number-box">
        <i className="fa-solid fa-mobile-screen"></i>
        <div>
          <span className="inp-label">رقم InstaPay</span>
          <b className="inp-num">{INSTAPAY_NUMBER}</b>
        </div>
        <button className="btn-copy" onClick={handleCopy} aria-label="نسخ الرقم">
          <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
        </button>
      </div>

      <button className="btn btn-accent btn-block" onClick={onMarkPaid}>
        لقد قمت بإرسال الدفع
      </button>

      <p className="instapay-note">
        <i className="fa-solid fa-circle-info"></i>
        يتم التحقق من الدفع يدوياً. تم حجز ملعبك لمدة{" "}
        <b>
          {mm}:{ss}
        </b>
        .
      </p>
    </div>
  );
}
