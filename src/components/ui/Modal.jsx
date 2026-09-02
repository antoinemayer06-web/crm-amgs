const sizes = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
}

export default function Modal({ title, onClose, children, size = 'md' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-lg bg-surface shadow-xl ${sizes[size] ?? sizes.md}`}
      >
        <div className="flex items-center justify-between border-b border-chrome-dark px-5 py-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-tertiary hover:text-ink-secondary"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
