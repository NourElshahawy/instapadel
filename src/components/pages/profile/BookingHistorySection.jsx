export default function BookingHistorySection({ bookings }) {
  return (
    <div className="profile-section">
      <h2><i className="fa-solid fa-calendar"></i> حجوزاتي</h2>
      {bookings.length === 0 ? (
        <div className="profile-empty-card">
          <i className="fa-solid fa-calendar-xmark"></i>
          لسه معملتش أي حجز. <a href="/courts" className="auth-link">دور على ملعب دلوقتي</a>
        </div>
      ) : (
        bookings.map((b) => (
          <div className="booking-history-card" key={b.id}>
            <div className="bhc-info">
              <b>{b.venue_name} — {b.court_name}</b>
              <span>{b.date} · {b.time}</span>
            </div>
            <span className="bhc-price">{b.price} ج.م</span>
          </div>
        ))
      )}
    </div>
  );
}