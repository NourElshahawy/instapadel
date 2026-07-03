export default function FloatingActionButton({ label, onClick, tone = "court", disabled }) {
  return (
    <div className="td-fab-wrap">
      <button type="button" className={`td-fab td-fab--${tone}`} onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </div>
  );
}
