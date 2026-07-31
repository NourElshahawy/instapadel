"use client";
import { useEffect, useState } from "react";

const INSTAPAY_NUMBER = "01065801252";

export default function ConfirmSheet({ isOpen, onClose, onConfirm, confirming, review }) {
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProofFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!proofFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(proofFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [proofFile]);

  if (!isOpen) return null;

  const deposit = Math.round(review.price / 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTAPAY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProofFile(file);
  };

  return (
    <div className="confirm-sheet active" onClick={(e) => e.target === e.currentTarget && !confirming && onClose()}>
      <div className="sheet-content">
        <div className="sheet-handle" />
        <h2>تأكيد الحجز</h2>

        <div className="booking-review">
          <div className="review-item">
            <span>ملعب</span>
            <strong>{review.venueName}</strong>
          </div>
          <div className="review-item">
            <span>رقم الملعب</span>
            <strong>{review.subCourtName}</strong>
          </div>
          <div className="review-item">
            <span>التاريخ</span>
            <strong>{review.date}</strong>
          </div>
          <div className="review-item">
            <span>الوقت</span>
            <strong>{review.time}</strong>
          </div>
          <div className="review-item total-row">
            <span>الإجمالي</span>
            <strong>{review.price} EGP</strong>
          </div>
        </div>

        <div className="deposit-box">
          <div className="deposit-header">
            <span className="deposit-header-label">
              <i className="fa-solid fa-shield-halved"></i> ديبوزيت لتأكيد الحجز
            </span>
            <span className="deposit-header-note">الباقي {review.price - deposit} ج.م يتدفع في الملعب</span>
          </div>

          <div className="deposit-amount-display">
            <span>{deposit}</span>
            <small>ج.م</small>
          </div>

          <div className="deposit-notice">
            <i className="fa-solid fa-circle-info"></i>
            <span>الحجز بيتأكد بس بعد دفع الديبوزيت. لو خرجت من غير دفع، المواعيد دي تفضل متاحة لحد تاني فورًا.</span>
          </div>

          <div className="instapay-number-box">
            <i className="fa-solid fa-mobile-screen"></i>
            <div>
              <span className="inp-label">رقم InstaPay</span>
              <b className="inp-num">{INSTAPAY_NUMBER}</b>
            </div>
            <button type="button" className="btn-copy" onClick={handleCopy} aria-label="نسخ الرقم">
              <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
            </button>
          </div>

          <label className="instapay-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            {previewUrl ? (
              <img src={previewUrl} alt="إثبات الدفع" className="instapay-upload-preview" />
            ) : (
              <>
                <i className="fa-solid fa-camera"></i>
                <span>ارفع صورة إثبات تحويل الديبوزيت (إجباري)</span>
              </>
            )}
          </label>
        </div>

        <button className="confirm-btn" onClick={() => onConfirm(proofFile)} disabled={confirming || !proofFile}>
          <i className="fa-solid fa-lock" /> {confirming ? "جاري التأكيد…" : "تأكيد الحجز"}
        </button>
        <button className="cancel-sheet-btn" onClick={onClose} disabled={confirming}>
          الغاء
        </button>
      </div>
    </div>
  );
}
