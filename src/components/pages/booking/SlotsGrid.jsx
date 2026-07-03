export default function SlotsGrid({ slots, selectedTimes, onToggle, locked }) {
  return (
    <section className={`booking-slots ${locked ? "section-locked" : ""}`} data-requires="اليوم">
      <div className="section-title">
        <h2>اختر الموعد المناسب</h2>
        <span>اضغط لاختيار الموعد</span>
      </div>

      <div className="slots-legend">
        <span>
          <em className="leg-dot available" /> متاح
        </span>
        <span>
          <em className="leg-dot booked" /> محجوز
        </span>
      </div>
      <div className="slots-legend">
        <span>
          <em className="leg-dot available" /> متاح اختيار اكثر من ساعة
        </span>
      </div>

      <div className="slots-grid">
        {slots.map((slot) => {
          const isBooked = slot.status === "booked";
          const isSelected = selectedTimes.includes(slot.start);

          return (
            <button key={slot.start} type="button" className={`slot-card ${isBooked ? "booked" : "available"} ${isSelected ? "selected" : ""}`} disabled={isBooked} onClick={() => onToggle(slot)}>
              <span className="slot-status" />
              {isSelected && (
                <span className="slot-check">
                  <i className="fa-solid fa-check" />
                </span>
              )}
              <h3>{slot.start}</h3>
              <h3>الي</h3>
              <h3>{slot.end}</h3>
              {isBooked && <p>محجوز</p>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
