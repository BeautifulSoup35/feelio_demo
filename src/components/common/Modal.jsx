export default function Modal({ title, children, onClose }) {
  return (
    <div className="modalLayer" role="presentation" onMouseDown={onClose}>
      <section className="modalPanel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}>
        <div className="modalHeader">
          <h2>{title}</h2>
          <button type="button" className="iconButton" onClick={onClose} aria-label="닫기">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
