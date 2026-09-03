import { useMemo, useState } from 'react'
import RecurringInvoiceRow from '../finance/RecurringInvoiceRow'
import Modal from '../ui/Modal'
import {
  useCreateRecurringInvoice,
  useDeleteRecurringInvoice,
  useRecurringInvoicesByCompany,
} from '../../hooks/useRecurringInvoices'
import RecurringInvoiceForm from './RecurringInvoiceForm'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

const FREQUENCE_LABELS = { jour: 'jours', semaine: 'semaines', mois: 'mois' }

// Une facture récurrente est matérialisée en plusieurs occurrences dès sa
// création (voir buildRecurrenceOccurrences) — sur la fiche entreprise, on
// les regroupe par définition d'origine (nom + montant + récurrence) pour
// n'afficher qu'une ligne résumé, plutôt que jusqu'à 52 lignes à plat.
function groupInvoices(invoices) {
  const groups = new Map()
  for (const invoice of invoices) {
    const key = invoice.recurrence_frequence
      ? [
          invoice.nom,
          invoice.montant,
          invoice.recurrence_frequence,
          invoice.recurrence_intervalle,
          invoice.recurrence_fin,
        ].join('|')
      : `single-${invoice.id}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(invoice)
  }
  return [...groups.values()].map((occurrences) => {
    const sorted = [...occurrences].sort((a, b) => new Date(a.date_prevue) - new Date(b.date_prevue))
    const nextDue = sorted.find((invoice) => !invoice.facturee) ?? null
    const facturedCount = sorted.filter((invoice) => invoice.facturee).length
    const paidCount = sorted.filter((invoice) => invoice.payee).length
    return { key: sorted[0].id, occurrences: sorted, nextDue, facturedCount, paidCount }
  })
}

function GroupSummaryRow({ group, expanded, onToggle }) {
  const first = group.occurrences[0]
  const isRecurring = group.occurrences.length > 1
  const total = group.occurrences.length

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-left text-sm hover:bg-surface-hover"
    >
      <span
        className={`shrink-0 text-ink-tertiary transition-transform ${expanded ? 'rotate-90' : ''}`}
        aria-hidden="true"
      >
        ›
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-ink">{first.nom}</span>
          {isRecurring && (
            <span className="shrink-0 text-xs text-ink-tertiary">
              ↻ tous les {first.recurrence_intervalle} {FREQUENCE_LABELS[first.recurrence_frequence]}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-tertiary">
          {group.nextDue
            ? `Prochaine échéance : ${formatDate(group.nextDue.date_prevue)}`
            : 'Toutes facturées'}
          {isRecurring && ` — ${group.facturedCount}/${total} facturées, ${group.paidCount}/${total} payées`}
        </p>
      </div>
      <span className="shrink-0 font-medium tabular-nums text-ink">{formatMontant(first.montant)}</span>
    </button>
  )
}

// Factures récurrentes de l'entreprise — indépendantes des projets
// (voir DocumentsTab/DocumentsSection pour la facturation par projet,
// qui reste inchangée).
export default function RecurringInvoicesTab({ companyId }) {
  const [creating, setCreating] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(() => new Set())
  const { data: invoices, isLoading, isError, error } = useRecurringInvoicesByCompany(companyId)
  const createInvoice = useCreateRecurringInvoice()
  const deleteInvoice = useDeleteRecurringInvoice()

  const groups = useMemo(() => groupInvoices(invoices ?? []), [invoices])

  function toggleExpanded(key) {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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
        {!isLoading && !isError && groups.length === 0 && (
          <p className="text-sm text-ink-tertiary">Aucune facture récurrente pour cette entreprise.</p>
        )}
        {!isLoading && !isError && groups.length > 0 && (
          <ul className="divide-y divide-chrome-dark">
            {groups.map((group) => (
              <li key={group.key}>
                <GroupSummaryRow
                  group={group}
                  expanded={expandedKeys.has(group.key)}
                  onToggle={() => toggleExpanded(group.key)}
                />
                {expandedKeys.has(group.key) && (
                  <ul className="divide-y divide-chrome-dark border-t border-chrome-dark bg-surface/40 pl-6">
                    {group.occurrences.map((invoice) => (
                      <RecurringInvoiceRow key={invoice.id} invoice={invoice} onDelete={handleDelete} />
                    ))}
                  </ul>
                )}
              </li>
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
