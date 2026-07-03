"use client";
import { useState } from "react";
import EmailNotice from "./EmailNotice";
import StatusTracker from "./StatusTracker";
import BookAgainCard from "./BookAgainCard";
import BookingSummarySidebar from "./BookingSummarySidebar";
import "@/styles/pages/booking-confirmation.css";

export default function BookingConfirmationPage({ booking }) {
  const [showEmailNotice, setShowEmailNotice] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  return (
    <main className="confirmation-main">
      <div className="container">
        <div className="confirmation-grid">
          <div className="confirmation-left">
            {showEmailNotice && <EmailNotice email={booking.email} onDismiss={() => setShowEmailNotice(false)} />}

            <div className="booking-header">
              <div>
                <p className="booking-id">
                  الحجز <b>{booking.id}</b>
                </p>
                <h1>{isPaid ? "تم تأكيد الدفع. نراكم في الملعب." : "كل شيء جاهز. نراكم في الملعب."}</h1>
              </div>
              <span className={`status-pill ${isPaid ? "paid" : "confirmed"}`}>
                <span className="pulse-dot" /> {isPaid ? "مدفوع" : "مؤكد"}
              </span>
            </div>

            <StatusTracker booking={booking} isPaid={isPaid} onMarkPaid={() => setIsPaid(true)} />
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
