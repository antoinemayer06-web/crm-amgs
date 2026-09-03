import {
  useSetRecurringInvoiceFactured,
  useSetRecurringInvoicePaid,
  useUpdateRecurringInvoiceFacturationDate,
  useUpdateRecurringInvoicePaymentDate,
} from '../../hooks/useRecurringInvoices'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

// Ligne d'occurrence de facture récurrente, réutilisée sur la fiche
// entreprise (une company à la fois) et dans Finance (toutes companies,
// showCompany affiche alors le nom du client). Deux états indépendants :
// Facturée (compte dans le CA facturé) et Payée (compte dans le CA
// encaissé), comme pour la facturation par projet.
export default function RecurringInvoiceRow({ invoice, showCompany, onDelete }) {
  const setFactured = useSetRecurringInvoiceFactured()
  const updateFacturationDate = useUpdateRecurringInvoiceFacturationDate()
  const setPaid = useSetRecurringInvoicePaid()
  const updatePaymentDate = useUpdateRecurringInvoicePaymentDate()

  function handleToggleFactured(event) {
    setFactured.mutate({ id: invoice.id, facturee: event.target.checked, dateFacturation: invoice.date_facturation })
  }

  function handleFacturationDateChange(event) {
    updateFacturationDate.mutate({ id: invoice.id, dateFacturation: event.target.value || null })
  }

  function handleTogglePaid(event) {
    setPaid.mutate({ id: invoice.id, payee: event.target.checked, datePaiement: invoice.date_paiement })
  }

  function handlePaymentDateChange(event) {
    updatePaymentDate.mutate({ id: invoice.id, datePaiement: event.target.value || null })
  }

  return (
    <li className="space-y-2 py-2 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {showCompany && invoice.company?.name && (
              <span className="shrink-0 text-xs text-ink-tertiary">{invoice.company.name} —</span>
            )}
            <span className="text-ink-secondary">{invoice.nom}</span>
            {invoice.recurrence_frequence && (
              <span className="shrink-0 text-xs text-ink-tertiary" title="Facture récurrente">
                ↻
              </span>
            )}
          </div>
          <p className="text-xs text-ink-tertiary">Prévue le {formatDate(invoice.date_prevue)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-medium tabular-nums text-ink">{formatMontant(invoice.montant)}</span>
          <button
            type="button"
            onClick={() => onDelete(invoice)}
            className="text-ink-tertiary hover:text-red-400"
            aria-label="Supprimer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <input type="checkbox" checked={invoice.facturee} onChange={handleToggleFactured} className="h-4 w-4" />
            Facturée
          </label>
          {invoice.facturee && (
            <input
              type="date"
              value={invoice.date_facturation ?? ''}
              onChange={handleFacturationDateChange}
              className="rounded-md border border-chrome-dark bg-surface px-2 py-1 text-xs text-ink"
              aria-label="Date de facturation"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <input type="checkbox" checked={invoice.payee} onChange={handleTogglePaid} className="h-4 w-4" />
            Payée
          </label>
          {invoice.payee && (
            <input
              type="date"
              value={invoice.date_paiement ?? ''}
              onChange={handlePaymentDateChange}
              className="rounded-md border border-chrome-dark bg-surface px-2 py-1 text-xs text-ink"
              aria-label="Date de paiement"
            />
          )}
        </div>
      </div>
    </li>
  )
}
