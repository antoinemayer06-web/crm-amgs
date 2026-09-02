const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

export default function CashKpiCard({ facture, encaisse, restant }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Facturé vs encaissé
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-neutral-900">{formatMontant(facture)}</span>
        <span className="text-xs text-neutral-400">facturé</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-emerald-600">{formatMontant(encaisse)}</span>
        <span className="text-xs text-neutral-400">encaissé</span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Reste à encaisser : <span className="font-medium text-neutral-700">{formatMontant(restant)}</span>
      </p>
    </div>
  )
}
