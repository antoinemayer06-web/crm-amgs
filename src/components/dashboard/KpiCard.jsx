const TONE_TEXT = {
  neutral: 'text-ink',
  good: 'text-emerald-400',
  critical: 'text-red-400',
}

export default function KpiCard({ label, value, sublabel, tone = 'neutral' }) {
  return (
    <div className="card-chrome-lit overflow-hidden rounded-xl border border-chrome-dark bg-surface p-4">
      <p className="text-xs font-medium text-ink-tertiary">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${TONE_TEXT[tone] ?? TONE_TEXT.neutral}`}>
        {value}
      </p>
      {sublabel && <p className="mt-1 text-xs text-ink-secondary">{sublabel}</p>}
    </div>
  )
}
