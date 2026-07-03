const AMENITIES = [
  { value: "parking", label: "موقف سيارات مجاني", icon: "fa-circle-plus" },
  { value: "cafeteria", label: "كافتيريا", icon: "fa-mug-hot" },
  { value: "showers", label: "حمامات / دُش", icon: "fa-shower" },
  { value: "lockers", label: "خزائن", icon: "fa-lock" },
  { value: "wifi", label: "واي فاي مجاني", icon: "fa-wifi" },
  { value: "proshop", label: "متجر المحترفين", icon: "fa-store" },
  { value: "floodlights", label: "أضواء كاشفة", icon: "fa-sun" },
  { value: "academy", label: "أكاديمية / تدريب", icon: "fa-school" },
];

export default function Step4Amenities({ amenities, toggleAmenity, hours, updateHours, cancellationPolicy, setCancellationPolicy }) {
  return (
    <div className="wizard-step is-active">
      <div className="step-header">
        <span className="eyebrow">الخطوة 4 من 5</span>
        <h2 className="mt-2">المرافق وساعات العمل</h2>
        <p>دع اللاعبين يعرفون ما يمكن توقعه عند وصولهم.</p>
      </div>

      <div className="field-group">
        <label>المرافق المتاحة</label>
        <div className="amenity-check-grid">
          {AMENITIES.map((a) => (
            <label className="amenity-check-item" key={a.value}>
              <input type="checkbox" checked={amenities.includes(a.value)} onChange={() => toggleAmenity(a.value)} />
              <span className="ach-box">
                <i className={`fa-solid ${a.icon}`}></i> {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label>ساعات العمل</label>
        <div className="hours-grid">
          <div className="hours-row">
            <span className="day-label">السبت – الخميس</span>
            <div className="field-input-wrap flex-1">
              <input className="field-input" type="time" value={hours.weekdayOpen} onChange={(e) => updateHours({ weekdayOpen: e.target.value })} />
            </div>
            <span className="hours-sep">إلى</span>
            <div className="field-input-wrap flex-1">
              <input className="field-input" type="time" value={hours.weekdayClose} onChange={(e) => updateHours({ weekdayClose: e.target.value })} />
            </div>
          </div>
          <div className="hours-row">
            <span className="day-label">الجمعة</span>
            <div className="field-input-wrap flex-1">
              <input className="field-input" type="time" value={hours.fridayOpen} onChange={(e) => updateHours({ fridayOpen: e.target.value })} />
            </div>
            <span className="hours-sep">إلى</span>
            <div className="field-input-wrap flex-1">
              <input className="field-input" type="time" value={hours.fridayClose} onChange={(e) => updateHours({ fridayClose: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      <div className="field-group">
        <label>سياسة الإلغاء</label>
        <div className="field-input-wrap">
          <i className="fa-solid fa-file-shield field-icon"></i>
          <select className="field-input" value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)}>
            <option value="flexible">مرن — إلغاء قبل 6 ساعات</option>
            <option value="moderate">معتدل — إلغاء قبل 24 ساعة</option>
            <option value="strict">صارم — لا يُسمح بالإلغاء</option>
          </select>
        </div>
      </div>
    </div>
  );
}
