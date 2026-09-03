export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-2 text-left"
    >
      {label && <span className="text-sm text-ink-secondary">{label}</span>}
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ${
          checked ? 'bg-chrome-light' : 'bg-chrome-dark'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform duration-150 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}
