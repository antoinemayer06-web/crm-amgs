import { useMemo, useState } from 'react'
import { useCreateExpense, useDeleteExpense } from '../../hooks/useFinance'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_TONES } from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import ExpenseForm from './ExpenseForm'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

// Dépenses du mois sélectionné, avec ajout (récurrence possible) et
// suppression (occurrence par occurrence, sans lien de groupe).
export default function ExpensesPanel({ expenses, monthKey }) {
  const [creating, setCreating] = useState(false)
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()

  const monthExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => (expense.date_depense ?? '').slice(0, 7) === monthKey)
        .sort((a, b) => new Date(b.date_depense) - new Date(a.date_depense)),
    [expenses, monthKey],
  )

  async function handleDelete(id, libelle) {
    if (!window.confirm(`Supprimer la dépense « ${libelle} » ?`)) return
    await deleteExpense.mutateAsync(id)
  }

  return (
    <div className="card-glass rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Dépenses du mois</h3>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md border border-chrome-dark px-2.5 py-1 text-xs font-medium text-ink-secondary hover:bg-surface-hover"
        >
          + Ajouter une dépense
        </button>
      </div>

      {monthExpenses.length === 0 ? (
        <p className="text-sm text-ink-tertiary">Aucune dépense enregistrée sur ce mois.</p>
      ) : (
        <ul className="divide-y divide-chrome-dark">
          {monthExpenses.map((expense) => (
            <li key={expense.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
              <Badge tone={EXPENSE_CATEGORY_TONES[expense.categorie]}>
                {EXPENSE_CATEGORY_LABELS[expense.categorie]}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-ink-secondary">{expense.libelle}</span>
              {expense.recurrence_frequence && (
                <span className="shrink-0 text-xs text-ink-tertiary" title="Dépense récurrente">
                  ↻
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDelete(expense.id, expense.libelle)}
                className="order-last shrink-0 text-ink-tertiary hover:text-red-400 sm:order-none"
                aria-label="Supprimer"
              >
                ✕
              </button>
              <span className="ml-auto shrink-0 text-xs text-ink-tertiary sm:ml-0">
                {formatDate(expense.date_depense)}
              </span>
              <span className="shrink-0 font-medium tabular-nums text-ink">{formatMontant(expense.montant)}</span>
            </li>
          ))}
        </ul>
      )}

      {creating && (
        <Modal title="Nouvelle dépense" onClose={() => setCreating(false)}>
          <ExpenseForm
            submitting={createExpense.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await createExpense.mutateAsync(values)
              setCreating(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
