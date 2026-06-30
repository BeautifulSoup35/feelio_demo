export default function Modal({
  isOpen = true,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'default',
  className = '',
  showClose = true
}) {
  if (!isOpen) return null;

  return (
    <div className="modalLayer glassModalContainer" role="presentation" onMouseDown={onClose}>
      <section
        className={`modalPanel glassModal modal-${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={event => event.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="modalHeader glassModalHeader">
            <div>
              {title && <h2 className="modalTitle">{title}</h2>}
              {description && <p className="modalDescription">{description}</p>}
            </div>
            {showClose && (
              <button type="button" className="iconButton modalCloseButton" onClick={onClose} aria-label="닫기">×</button>
            )}
          </div>
        )}

        <div className="modalContent">
          {children}
        </div>

        {footer && <div className="modalFooter">{footer}</div>}
      </section>
    </div>
  );
}
