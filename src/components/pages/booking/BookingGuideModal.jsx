"use client";
import { useState } from "react";

const STEPS = [
  { icon: "fa-table-tennis-paddle-ball", title: "اختار الملعب", text: "دوس على الملعب الفرعي اللي عايز تلعب فيه." },
  { icon: "fa-calendar-days", title: "اختار اليوم", text: "بعد اختيار الملعب هنوديك على طول لاختيار اليوم المناسب." },
  { icon: "fa-clock", title: "اختار الوقت", text: "بعد اختيار اليوم هنوديك على طول لاختيار الساعة، وتقدر تختار أكتر من ساعة." },
];

export default function BookingGuideModal({ onClose }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="booking-guide-overlay">
      <div className="booking-guide-card">
        <button className="booking-guide-skip" onClick={onClose}>
          تخطي
        </button>
        <i className={`booking-guide-icon fa-solid ${STEPS[step].icon}`}></i>
        <h3>{STEPS[step].title}</h3>
        <p>{STEPS[step].text}</p>
        <div className="booking-guide-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`booking-guide-dot ${i === step ? "is-active" : ""}`} />
          ))}
        </div>
        <button className="btn btn-accent btn-block" onClick={handleNext}>
          {isLast ? "يلا نبدأ" : "التالي"}
        </button>
      </div>
    </div>
  );
}
