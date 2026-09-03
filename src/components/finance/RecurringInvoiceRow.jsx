import { useSetRecurringInvoicePaid, useUpdateRecurringInvoicePaymentDate } from '../../hooks/useRecurringInvoices'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

// Ligne d'occurrence de facture récurrente, réutilisée sur la fiche
// entreprise (une company à la fois) et dans Finance (toutes companies,
// showCompany affiche alors le nom du client).
export default function RecurringInvoiceRow({ invoice, showCompany, onDelete }) {
  const setPaid = useSetRecurringInvoicePaid()
  const updatePaymentDate = useUpdateRecurringInvoicePaymentDate()

  function handleTogglePaid(event) {
    setPaid.mutate({ id: invoice.id, payee: event.target.checked, datePaiement: invoice.date_paiement })
  }

  function handlePaymentDateChange(event) {
    updatePaymentDate.mutate({ id: invoice.id, datePaiement: event.target.value || null })
  }

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2 text-sm">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {showCompany && invoice.company?.name && (
            <span className="shrink-0 text-xs text-ink-tertiary">{invoice.company.name} —</span>
          )}
          <span className="truncate text-ink-secondary">{invoice.nom}</span>
          {invoice.recurrence_frequence && (
            <span className="shrink-0 text-xs text-ink-tertiary" title="Facture récurrente">
              ↻
            </span>
          )}
        </div>
        <p className="text-xs text-ink-tertiary">Prévue le {formatDate(invoice.date_prevue)}</p>
      </div>

      <label className="flex shrink-0 items-center gap-1.5 text-xs text-ink-secondary">
        <input type="checkbox" checked={invoice.payee} onChange={handleTogglePaid} className="h-4 w-4" />
        Payée
      </label>

      {invoice.payee && (
        <input
          type="date"
          value={invoice.date_paiement ?? ''}
          onChange={handlePaymentDateChange}
          className="shrink-0 rounded-md border border-chrome-dark bg-surface px-2 py-1 text-xs text-ink"
          aria-label="Date de paiement"
        />
      )}

      <button
        type="button"
        onClick={() => onDelete(invoice)}
        className="order-last shrink-0 text-ink-tertiary hover:text-red-400 sm:order-none"
        aria-label="Supprimer"
      >
        ✕
      </button>

      <span className="ml-auto shrink-0 font-medium tabular-nums text-ink sm:ml-0">
        {formatMontant(invoice.montant)}
      </span>
    </li>
  )
}
