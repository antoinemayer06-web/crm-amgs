const JAR_PATH =
  'M46,70 h108 a10,10 0 0 1 10,10 v130 a14,14 0 0 1 -14,14 h-100 a14,14 0 0 1 -14,-14 v-130 a10,10 0 0 1 10,-10 z'
const JAR_TOP = 84
const JAR_BOTTOM = 208
const JAR_HEIGHT = JAR_BOTTOM - JAR_TOP

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

// Bocal qui se remplit visuellement selon la progression du résultat
// réalisé vers l'objectif de résultat mensuel — recalculé à chaque
// nouvel encaissement (les données viennent de React Query, la barre se
// met simplement à jour avec une transition).
export default function FinanceGoalJar({ objectif, realise }) {
  const pct = objectif > 0 ? clamp((realise / objectif) * 100, 0, 100) : 0
  const isNegative = realise < 0
  const fillColor = isNegative ? '#d03b3b' : '#0f9d58'
  const liquidTopY = JAR_BOTTOM - (pct / 100) * JAR_HEIGHT

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 200 240" className="h-56 w-40" role="img" aria-label={`${Math.round(pct)} % de l'objectif atteint`}>
        <defs>
          <clipPath id="jarClip">
            <path d={JAR_PATH} />
          </clipPath>
          <linearGradient id="jarLiquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.88" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect x="72" y="36" width="56" height="14" rx="4" fill="#a3a3a3" />
        <rect x="60" y="48" width="80" height="14" rx="6" fill="#d4d4d4" />

        <path d={JAR_PATH} fill="#fafaf9" stroke="#d4d4d4" strokeWidth="3" />

        <g clipPath="url(#jarClip)">
          <rect
            x="36"
            y={liquidTopY}
            width="128"
            height="200"
            fill="url(#jarLiquid)"
            style={{ transition: 'y 0.9s ease-out' }}
          />
          {pct > 8 && (
            <rect x="72" y={liquidTopY + 12} width="24" height="13" rx="2" fill="#fff" opacity="0.55" />
          )}
          {pct > 28 && (
            <rect x="104" y={liquidTopY + 32} width="24" height="13" rx="2" fill="#fff" opacity="0.5" />
          )}
          {pct > 50 && (
            <rect x="62" y={liquidTopY + 56} width="24" height="13" rx="2" fill="#fff" opacity="0.45" />
          )}
          {pct > 72 && (
            <rect x="96" y={liquidTopY + 80} width="24" height="13" rx="2" fill="#fff" opacity="0.4" />
          )}
        </g>

        <path d="M60,84 v112" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </svg>

      <div className="text-center">
        <p className={`text-2xl font-bold ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
          {Math.round(pct)} %
        </p>
        <p className="text-xs text-ink-tertiary">de l'objectif atteint</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 text-center">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-tertiary">Objectif</p>
          <p className="text-sm font-semibold text-ink">{formatMontant(objectif)}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-tertiary">Réalisé</p>
          <p className={`text-sm font-semibold ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatMontant(realise)}
          </p>
        </div>
      </div>
    </div>
  )
}
