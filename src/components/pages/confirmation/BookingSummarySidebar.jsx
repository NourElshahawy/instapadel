export default function BookingSummarySidebar({ booking, isPaid }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "InstaPadel", url: window.location.href });
      } catch {}
    }
  };

  return (
    <div className="summary-sticky">
      <div className="summary-venue-img">
        <img src={booking.venueImage} alt={booking.venueName} />
        <div className="svi-overlay">
          <span className="court-badge-live" style={{ position: "static", display: "inline-flex" }}>
            <span className="pulse-dot" /> مباشر
          </span>
        </div>
      </div>

      <div className="summary-body">
        <h3 className="summary-venue-name">{booking.venueName}</h3>
        {booking.locationLink && (
          <a href={booking.locationLink} target="_blank" rel="noreferrer" className="court-loc-inline" style={{ marginBottom: 18, display: "flex" }}>
            <i className="fa-solid fa-location-dot" /> {booking.location}
          </a>
        )}

        <div className="summary-rows">
          <div className="summary-row">
            <span>الملعب</span>
            <span>{booking.subCourtName}</span>
          </div>
          <div className="summary-row">
            <span>التاريخ</span>
            <span>{booking.date}</span>
          </div>
          <div className="summary-row">
            <span>الوقت</span>
            <span>{booking.time}</span>
          </div>
        </div>

        <div className="summary-total-row">
          <span>الإجمالي</span>
          <b>{booking.price} ج.م</b>
        </div>

        <div className={`payment-status-badge ${isPaid ? "is-paid" : ""}`}>
          <i className={`fa-solid ${isPaid ? "fa-circle-check" : "fa-clock"}`}></i>
          <span>{isPaid ? "تم الدفع" : "في انتظار الدفع"}</span>
        </div>

        <div className="summary-actions">
          <button className="summary-action-btn" type="button">
            <i className="fa-solid fa-download"></i> تحميل الإيصال
          </button>
          <button className="summary-action-btn" type="button" onClick={handleShare}>
            <i className="fa-solid fa-share-nodes"></i> مشاركة الحجز
          </button>
          <button className="summary-action-btn danger" type="button">
            <i className="fa-solid fa-circle-xmark"></i> إلغاء الحجز
          </button>
        </div>
      </div>
    </div>
  );
}
