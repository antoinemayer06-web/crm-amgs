import { useState } from 'react'
import RecurringInvoiceRow from '../finance/RecurringInvoiceRow'
import Modal from '../ui/Modal'
import {
  useCreateRecurringInvoice,
  useDeleteRecurringInvoice,
  useRecurringInvoicesByCompany,
} from '../../hooks/useRecurringInvoices'
import RecurringInvoiceForm from './RecurringInvoiceForm'

// Factures récurrentes de l'entreprise — indépendantes des projets
// (voir DocumentsTab/DocumentsSection pour la facturation par projet,
// qui reste inchangée).
export default function RecurringInvoicesTab({ companyId }) {
  const [creating, setCreating] = useState(false)
  const { data: invoices, isLoading, isError, error } = useRecurringInvoicesByCompany(companyId)
  const createInvoice = useCreateRecurringInvoice()
  const deleteInvoice = useDeleteRecurringInvoice()

  async function handleDelete(invoice) {
    if (!window.confirm(`Supprimer la facture « ${invoice.nom} » du ${new Date(invoice.date_prevue).toLocaleDateString('fr-FR')} ?`)) {
      return
    }
    await deleteInvoice.mutateAsync(invoice.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className="btn-primary">
          + Ajouter une facture récurrente
        </button>
      </div>

      <div className="card-glass rounded-xl p-4">
        {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
        {isError && <p className="text-sm font-medium text-red-400">Erreur : {error.message}</p>}
        {!isLoading && !isError && invoices.length === 0 && (
          <p className="text-sm text-ink-tertiary">Aucune facture récurrente pour cette entreprise.</p>
        )}
        {!isLoading && !isError && invoices.length > 0 && (
          <ul className="divide-y divide-chrome-dark">
            {invoices.map((invoice) => (
              <RecurringInvoiceRow key={invoice.id} invoice={invoice} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>

      {creating && (
        <Modal title="Nouvelle facture récurrente" onClose={() => setCreating(false)}>
          <RecurringInvoiceForm
            submitting={createInvoice.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await createInvoice.mutateAsync({ ...values, company_id: companyId })
              setCreating(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
