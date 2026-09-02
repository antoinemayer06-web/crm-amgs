export default function DensityToggle({ density, onChange }) {
  return (
    <div className="flex shrink-0 rounded-md border border-chrome-dark p-0.5">
      <button
        type="button"
        onClick={() => onChange('comfortable')}
        className={`rounded px-2.5 py-1 text-xs transition-colors duration-150 ${
          density === 'comfortable' ? 'bg-surface-hover text-ink' : 'text-ink-tertiary hover:text-ink-secondary'
        }`}
      >
        Confortable
      </button>
      <button
        type="button"
        onClick={() => onChange('compact')}
        className={`rounded px-2.5 py-1 text-xs transition-colors duration-150 ${
          density === 'compact' ? 'bg-surface-hover text-ink' : 'text-ink-tertiary hover:text-ink-secondary'
        }`}
      >
        Compact
      </button>
    </div>
  )
}
