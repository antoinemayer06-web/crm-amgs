import { useMemo } from 'react'
import { useDeleteRecurringInvoice } from '../../hooks/useRecurringInvoices'
import RecurringInvoiceRow from './RecurringInvoiceRow'

// Factures récurrentes prévues sur le mois sélectionné (toutes
// entreprises confondues) — création/suppression se fait depuis la
// fiche entreprise (RecurringInvoicesTab) ; ici on gère le paiement.
export default function RecurringInvoicesPanel({ recurringInvoices, monthKey }) {
  const deleteInvoice = useDeleteRecurringInvoice()

  const monthInvoices = useMemo(
    () =>
      recurringInvoices
        .filter((invoice) => (invoice.date_prevue ?? '').slice(0, 7) === monthKey)
        .sort((a, b) => new Date(a.date_prevue) - new Date(b.date_prevue)),
    [recurringInvoices, monthKey],
  )

  async function handleDelete(invoice) {
    if (!window.confirm(`Supprimer la facture « ${invoice.nom} » ?`)) return
    await deleteInvoice.mutateAsync(invoice.id)
  }

  return (
    <div className="card-glass rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Factures récurrentes du mois</h3>
        <p className="text-xs text-ink-tertiary">Ajout depuis la fiche entreprise</p>
      </div>

      {monthInvoices.length === 0 ? (
        <p className="text-sm text-ink-tertiary">Aucune facture récurrente prévue ce mois-ci.</p>
      ) : (
        <ul className="divide-y divide-chrome-dark">
          {monthInvoices.map((invoice) => (
            <RecurringInvoiceRow key={invoice.id} invoice={invoice} showCompany onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  )
}
