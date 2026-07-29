"use client";
import { useState } from "react";
import EmailNotice from "./EmailNotice";
import StatusTracker from "./StatusTracker";
import BookAgainCard from "./BookAgainCard";
import BookingSummarySidebar from "./BookingSummarySidebar";
import ReviewPrompt from "@/components/pages/booking/confirmation/ReviewPrompt";
// import "@/styles/pages/booking-confirmation.css";

export default function BookingConfirmationPage({ booking, userId }) {
  const [showEmailNotice, setShowEmailNotice] = useState(true);
  const [isPaid, setIsPaid] = useState(booking.paymentStatus === "paid");
  const [isClaimed, setIsClaimed] = useState(!!booking.paymentClaimedAt);
  const [showReview, setShowReview] = useState(!booking.reviewed);

  return (
    <main className="confirmation-main">
      <div className="container">
        <div className="confirmation-grid">
          <div className="confirmation-left">
            {showEmailNotice && <EmailNotice email={booking.email} onDismiss={() => setShowEmailNotice(false)} />}

            <div className="booking-header">
              <div>
                <p className="booking-id">
                  الحجز <b>{booking.displayId}</b>
                </p>
                <h1>{isPaid ? "تم تأكيد الدفع. نراكم في الملعب." : "كل شيء جاهز. نراكم في الملعب."}</h1>
              </div>
              <span className={`status-pill ${isPaid ? "paid" : "confirmed"}`}>
                <span className="pulse-dot" /> {isPaid ? "مدفوع" : "مؤكد"}
              </span>
            </div>

            <StatusTracker booking={booking} isPaid={isPaid} isClaimed={isClaimed} onMarkPaid={() => setIsClaimed(true)} />
            {showReview && (
              <div className="review-modal-overlay">
                <div className="review-modal-box">
                  <ReviewPrompt bookingId={booking.id} courtId={booking.courtId} userId={userId} onSubmitted={() => setShowReview(false)} />
                </div>
              </div>
            )}
            <BookAgainCard />
          </div>

          <div className="confirmation-right">
            <BookingSummarySidebar booking={booking} isPaid={isPaid} />
          </div>
        </div>
      </div>
    </main>
  );
}
