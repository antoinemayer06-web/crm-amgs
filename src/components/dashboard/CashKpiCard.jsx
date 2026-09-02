const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

export default function CashKpiCard({ facture, encaisse, restant }) {
  return (
    <div className="card-chrome-lit overflow-hidden rounded-xl border border-chrome-dark bg-surface p-4">
      <p className="text-xs font-medium text-ink-tertiary">
        Facturé vs encaissé
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold tabular-nums text-ink">{formatMontant(facture)}</span>
        <span className="text-xs text-ink-tertiary">facturé</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold tabular-nums text-emerald-400">{formatMontant(encaisse)}</span>
        <span className="text-xs text-ink-tertiary">encaissé</span>
      </div>
      <p className="mt-1 text-xs text-ink-secondary">
        Reste à encaisser :{' '}
        <span className="font-medium tabular-nums text-ink-secondary">{formatMontant(restant)}</span>
      </p>
    </div>
  )
}
