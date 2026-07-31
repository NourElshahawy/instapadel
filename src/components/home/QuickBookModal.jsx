"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailableCourtsForSlots, bookSlotsNow } from "@/services/quickBookClient";

export default function QuickBookModal({ date, slots, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState("");

  const rangeLabel = `${slots[0].start} الي ${slots[slots.length - 1].end}`;

  useEffect(() => {
    let active = true;
    getAvailableCourtsForSlots(date, slots)
      .then((data) => active && setCourts(data))
      .catch(() => active && setError("حصل خطأ أثناء البحث"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [date, slots]);

  const handleBook = async (court) => {
    if (!confirm(`تأكيد الحجز في ${court.venueName} — ${court.courtName}\nالتاريخ: ${date}\nالوقت: ${rangeLabel}\nالإجمالي: ${court.totalPrice} ج.م`)) return;

    setBookingId(court.courtId);
    try {
      const booking = await bookSlotsNow({
        courtId: court.courtId,
        courtName: court.courtName,
        venueName: court.venueName,
        date,
        slots: court.slots,
        pricePerHour: court.pricePerHour,
      });
      onClose();
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      if (err.code === "NOT_LOGGED_IN") {
        router.push("/login");
        return;
      }
      if (err.code === "23505") {
        alert("للأسف حد سبقك حجز واحد أو أكتر من المواعيد دي، اختار ملعب تاني");
        setCourts((prev) => prev.filter((c) => c.courtId !== court.courtId));
      } else {
        alert("حصل خطأ أثناء الحجز، حاول تاني");
      }
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="booking-guide-overlay" onClick={onClose}>
      <div className="quick-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-guide-skip" onClick={onClose}>
          إغلاق
        </button>
        <h3 style={{ marginBottom: 4 }}>الملاعب المتاحة</h3>
        <p style={{ color: "var(--text-muted)", fontSize: ".85rem", marginBottom: 16 }}>
          {date} · {rangeLabel} ({slots.length} {slots.length === 1 ? "ساعة" : "ساعات"})
        </p>

        {loading ? (
          <p className="owner-table-empty">جاري البحث...</p>
        ) : error ? (
          <p className="owner-table-empty">{error}</p>
        ) : courts.length === 0 ? (
          <p className="owner-table-empty">للأسف مفيش ملاعب متاحة طول المدة دي كاملة.</p>
        ) : (
          <div className="quick-book-list">
            {courts.map((c) => (
              <div key={c.courtId} className="quick-book-row">
                <div>
                  <b>{c.venueName}</b>
                  <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{c.courtName}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>{c.totalPrice} ج.م</span>
                  <button className="btn btn-accent btn-sm" onClick={() => handleBook(c)} disabled={bookingId === c.courtId}>
                    {bookingId === c.courtId ? "جاري الحجز..." : "احجزه"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
