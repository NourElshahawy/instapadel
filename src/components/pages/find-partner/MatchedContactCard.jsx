export default function MatchedContactCard({ player }) {
  return (
    <div className="matched-contact-card">
      <span className="partner-avatar">{player.name.charAt(0)}</span>
      <div className="mcc-info">
        <b>{player.name}</b>
        <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{player.level}</span>
      </div>
      <div className="mcc-actions">
        <a className="mcc-btn whatsapp" href={`https://wa.me/${player.phone}`} target="_blank" rel="noreferrer" aria-label="واتساب">
          <i className="fa-brands fa-whatsapp" />
        </a>
        <a className="mcc-btn call" href={`tel:+${player.phone}`} aria-label="اتصال">
          <i className="fa-solid fa-phone"></i>
        </a>
      </div>
    </div>
  );
}
