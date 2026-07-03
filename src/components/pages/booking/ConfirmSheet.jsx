export default function ConfirmSheet({ isOpen, onClose, onConfirm, confirming, review }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-sheet active" onClick={(e) => e.target === e.currentTarget && onClose()}>
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
            <span>المدفوع</span>
            <strong>{review.price} EGP</strong>
          </div>
        </div>

        <button className="confirm-btn" onClick={onConfirm} disabled={confirming}>
          <i className="fa-solid fa-lock" /> {confirming ? "جاري التأكيد…" : "تأكيد & دفع"}
        </button>
        <button className="cancel-sheet-btn" onClick={onClose} disabled={confirming}>
          الغاء
        </button>
      </div>
    </div>
  );
}
