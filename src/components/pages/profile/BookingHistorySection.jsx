"use client";
import { useState } from "react";
import { cancelBooking } from "@/services/bookingClient";
import ReviewPrompt from "@/components/pages/booking/confirmation/ReviewPrompt"; 

export default function BookingHistorySection({
  bookings: initialBookings,
  currentUserId,
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (id) => {
    if (!confirm("متأكد إنك عايز تلغي الحجز ده؟")) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch {
      alert("حصل خطأ أثناء الإلغاء");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="profile-section">
      <h2>
        <i className="fa-solid fa-calendar-days"></i>حجوزاتي
      </h2>
      {bookings.length === 0 ? (
        <div className="profile-empty-card">
          <i className="fa-solid fa-calendar-xmark"></i>
          لسه معملتش أي حجز.{" "}
          <a href="/courts" className="auth-link">
            دور على ملعب دلوقتي
          </a>
        </div>
      ) : (
        bookings.map((b) => {
          const isPast = new Date(b.date) < new Date();
          const needsReview = isPast && b.status === "confirmed" && !b.reviewed; // محتاج نجيب حالة reviewed من الداتا

          return (
            <div key={b.id}>
              <div className="booking-history-card">
                <div className="bhc-info">
                  <b>
                    {b.venue_name} — {b.court_name}
                  </b>
                  <span>
                    {b.date} · {b.time}
                  </span>
                  {b.status === "cancelled" && (
                    <span
                      style={{
                        color: "#ff6b6b",
                        fontSize: ".76rem",
                        fontWeight: 700,
                      }}
                    >
                      {" "}
                      ملغي
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="bhc-price">{b.price} ج.م</span>
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff6b6b",
                        fontSize: ".76rem",
                        cursor: "pointer",
                      }}
                    >
                      {cancellingId === b.id ? "..." : "إلغاء"}
                    </button>
                  )}
                </div>
              </div>
              {needsReview && (
                <ReviewPrompt
                  bookingId={b.id}
                  courtId={b.court_id}
                  userId={currentUserId}
                  onSubmitted={() => {
                    setBookings((prev) =>
                      prev.map((x) =>
                        x.id === b.id ? { ...x, reviewed: true } : x,
                      ),
                    );
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
