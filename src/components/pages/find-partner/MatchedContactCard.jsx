import { toInternationalPhone } from "@/lib/formatPhone";

export default function MatchedContactCard({ player }) {
  const intlPhone = toInternationalPhone(player.phone);

  return (
    <div className="matched-contact-card">
      <span className="partner-avatar">{player.name?.charAt(0)}</span>
      <div className="mcc-info">
        <b>{player.name}</b>
        <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{player.level}</span>
      </div>
      <div className="mcc-actions">
        {intlPhone ? (
          <>
            <a className="mcc-btn whatsapp" href={`https://wa.me/${intlPhone}`} target="_blank" rel="noreferrer" aria-label="واتساب">
              <i className="fa-brands fa-whatsapp" />
            </a>
            <a className="mcc-btn call" href={`tel:+${intlPhone}`} aria-label="اتصال">
              <span className="material-symbols-rounded">call</span>
            </a>
          </>
        ) : (
          <span style={{ fontSize: ".76rem", color: "var(--text-faint)" }}>رقم غير متاح</span>
        )}
      </div>
    </div>
  );
}