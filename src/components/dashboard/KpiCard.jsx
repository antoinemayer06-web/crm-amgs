const TONE_TEXT = {
  neutral: 'text-neutral-900',
  good: 'text-emerald-600',
  critical: 'text-red-600',
}

export default function KpiCard({ label, value, sublabel, tone = 'neutral' }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${TONE_TEXT[tone] ?? TONE_TEXT.neutral}`}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-neutral-500">{sublabel}</p>}
    </div>
  )
}
