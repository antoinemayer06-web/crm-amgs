export default function ProgressBar({ done, total }) {
  if (!total) {
    return <p className="text-xs text-ink-tertiary">Aucune étape</p>
  }

  const percent = Math.round((done / total) * 100)

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
        <div
          className="h-full rounded-full bg-chrome-light transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-ink-tertiary">
        {done}/{total}
      </span>
    </div>
  )
}
