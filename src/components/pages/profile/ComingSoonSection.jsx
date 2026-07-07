export default function ComingSoonSection({ icon, title, text }) {
  return (
    <div className="profile-section">
      <h2>
        <i className={`fa-solid ${icon}`}></i> {title}
        <span className="coming-soon-badge">قريبًا</span>
      </h2>
      <div className="profile-empty-card">{text}</div>
    </div>
  );
}