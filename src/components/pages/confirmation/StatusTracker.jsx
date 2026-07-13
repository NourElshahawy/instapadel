

import PaymentMethodChoice from "../booking/confirmation/PaymentMethodChoice";

export default function StatusTracker({ booking, isPaid, onMarkPaid }) {
  return (
    <div className="tracker-card">
      <h3>حالة الحجز</h3>
      <div className="tracker">
        <div className="tracker-step is-done">
          <div className="ts-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="ts-body">
            <b>تم تأكيد الحجز</b>
            <span>تم حجز الفترة الخاصة بك في {booking.venueName}</span>
            <span className="ts-time">{booking.createdAt}</span>
          </div>
        </div>

        <div className="tracker-step is-done">
          <div className="ts-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="ts-body">
            <b>تم إرسال البريد الإلكتروني</b>
            <span>تم إرسال التأكيد إلى {booking.email}</span>
            <span className="ts-time">{booking.createdAt}</span>
          </div>
        </div>

        <div className={`tracker-step ${isPaid ? "is-done" : "is-pending"}`}>
          <div className="ts-icon">
            <i className="fa-solid fa-credit-card"></i>
          </div>
          <div className="ts-body">
            <b>الدفع</b>
            <span>{isPaid ? "تم استلام الدفع" : "في انتظار الدفع عبر InstaPay"}</span>
            <span className="ts-time">{isPaid ? "الآن" : "—"}</span>
            <PaymentMethodChoice amount={booking.price} bookingId={booking.displayId} isPaid={isPaid} onMarkPaid={onMarkPaid} />
          </div>
        </div>

        <div className="tracker-step is-upcoming">
          <div className="ts-icon">
            <i className="fa-solid fa-table-tennis-paddle-ball"></i>
          </div>
          <div className="ts-body">
            <b>توجه إلى الملعب</b>
            <span>أظهر معرف الحجز عند المدخل</span>
            <span className="ts-time">
              {booking.date} · {booking.time}
            </span>
          </div>
        </div>

        <div className="tracker-step is-upcoming">
          <div className="ts-icon">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div className="ts-body">
            <b>العب واستمتع</b>
            <span>
              {booking.subCourtName} · {booking.venueName}
            </span>
            <span className="ts-time">{booking.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
