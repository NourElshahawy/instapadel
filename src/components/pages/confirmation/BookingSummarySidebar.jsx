"use client";
import { useState } from "react";
import { cancelBooking } from "@/services/bookingClient";
import DownloadReceiptButton from "../booking/confirmation/DownloadReceiptButton";
// import DownloadReceiptButton from "./DownloadReceiptButton";

export default function BookingSummarySidebar({ booking, isPaid }) {
  const [cancelled, setCancelled] = useState(booking.status === "cancelled");
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
  if (!confirm("متأكد إنك عايز تلغي الحجز ده؟")) return;
  if (!booking.id) {
    alert("مش قادرين نلاقي الحجز ده، جرب تفتح الصفحة من جديد");
    return;
  }
  setCancelling(true);
  try {
    await cancelBooking(booking.id); // ← UUID حقيقي دلوقتي
    setCancelled(true);
  } catch {
    alert("حصل خطأ أثناء الإلغاء");
  } finally {
    setCancelling(false);
  }
};

  const handleShare = async () => {
    const shareText = `حجزي في ${booking.venueName} — ${booking.date}، ${booking.time}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "InstaPadel — تفاصيل الحجز", text: shareText, url: window.location.href });
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert("تم نسخ رابط الحجز");
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

        {cancelled ? (
          <div className="payment-status-badge" style={{ background: "rgba(255,107,107,.1)", color: "#ff6b6b" }}>
            <i className="fa-solid fa-circle-xmark"></i>
            <span>تم إلغاء الحجز</span>
          </div>
        ) : (
          <div className={`payment-status-badge ${isPaid ? "is-paid" : ""}`}>
            <i className={`fa-solid ${isPaid ? "fa-circle-check" : "fa-clock"}`}></i>
            <span>{isPaid ? "تم الدفع" : "في انتظار الدفع"}</span>
          </div>
        )}

        <div className="summary-actions">
          <DownloadReceiptButton booking={booking} />
          <button className="summary-action-btn" type="button" onClick={handleShare}>
            <i className="fa-solid fa-share-nodes"></i> مشاركة الحجز
          </button>
          {!cancelled && (
            <button className="summary-action-btn danger" type="button" onClick={handleCancel} disabled={cancelling}>
              <i className="fa-solid fa-circle-xmark"></i> {cancelling ? "جاري الإلغاء…" : "إلغاء الحجز"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
