"use client";
import { useState } from "react";
import { cancelBooking } from "@/services/bookingClient";
import ReviewPrompt from "@/components/pages/booking/confirmation/ReviewPrompt";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/ToastProvider";

function groupBookings(rows) {
  const groups = {};
  rows.forEach((b) => {
    const key = b.group_id || b.id;
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  });
  return Object.values(groups).map((items) => {
    const sorted = [...items].sort((a, b) => a.time.localeCompare(b.time));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
      groupId: first.group_id || first.id,
      bookingId: first.id,
      venue_name: first.venue_name,
      court_name: first.court_name,
      court_id: first.court_id,
      date: first.date,
      status: first.status,
      reviewed: first.reviewed,
      price: sorted.reduce((sum, x) => sum + x.price, 0),
      time: sorted.length === 1 ? first.time : `${first.time.split(" الي ")[0]} الي ${last.time.split(" الي ")[1]}`,
    };
  });
}

export default function BookingHistorySection({ bookings: initialBookings, currentUserId }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // ← بديل confirm()
  const { showToast } = useToast(); // ← بديل alert()

  const requestCancel = (id) => setConfirmTarget(id);

  const handleCancel = async () => {
    const id = confirmTarget;
    setConfirmTarget(null);
    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map((b) => ((b.group_id || b.id) === id ? { ...b, status: "cancelled" } : b)));
      showToast("تم إلغاء الحجز بنجاح", "success");
    } catch {
      showToast("حصل خطأ أثناء الإلغاء", "error");
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
        groupBookings(bookings).map((b) => {
          const isPast = new Date(b.date) < new Date();
          const needsReview = isPast && b.status === "confirmed" && !b.reviewed;

          return (
            <div key={b.groupId}>
              <div className="booking-history-card">
                <div className="bhc-info">
                  <b>
                    {b.venue_name} — {b.court_name}
                  </b>
                  <span>
                    {b.date} · {b.time}
                  </span>
                  {b.status === "cancelled" && <span style={{ color: "#ff6b6b", fontSize: ".76rem", fontWeight: 700 }}> ملغي</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="bhc-price">{b.price} ج.م</span>
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => requestCancel(b.groupId)}
                      disabled={cancellingId === b.groupId}
                      style={{ background: "none", border: "none", color: "#ff6b6b", fontSize: ".76rem", cursor: "pointer" }}>
                      {cancellingId === b.groupId ? "..." : "إلغاء"}
                    </button>
                  )}
                </div>
              </div>
              {needsReview && (
                <ReviewPrompt
                  bookingId={b.bookingId}
                  courtId={b.court_id}
                  userId={currentUserId}
                  onSubmitted={() => {
                    setBookings((prev) => prev.map((x) => ((x.group_id || x.id) === b.groupId ? { ...x, reviewed: true } : x)));
                  }}
                />
              )}
            </div>
          );
        })
      )}

      <ConfirmModal
        isOpen={confirmTarget !== null}
        title="تأكيد إلغاء الحجز"
        message="متأكد إنك عايز تلغي الحجز ده؟ الخطوة دي مش هترجع تاني."
        confirmLabel="نعم، ألغِ الحجز"
        cancelLabel="تراجع"
        danger
        onConfirm={handleCancel}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
