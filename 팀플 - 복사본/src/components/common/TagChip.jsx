export default function TagChip({ tag, active = false, onClick, icon }) {
  return (
    <button
      type="button"
      className={`tagChip ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--tag-color': tag.color }}
    >
      {icon ? <span className="tagIcon">{icon}</span> : <span className="tagDot" />}
      #{tag.name}
    </button>
  );
}
