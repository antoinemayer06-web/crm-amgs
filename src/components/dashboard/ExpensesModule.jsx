import { useMemo, useState } from 'react'
import { useCreateExpense, useDeleteExpense } from '../../hooks/useExpenses'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_TONES } from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import ExpenseForm from './ExpenseForm'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

export default function ExpensesModule({ expenses, expensesThisMonth, result }) {
  const [creating, setCreating] = useState(false)
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()

  const recent = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date_depense) - new Date(a.date_depense)).slice(0, 6),
    [expenses],
  )

  async function handleDelete(id, libelle) {
    if (!window.confirm(`Supprimer la dépense « ${libelle} » ?`)) return
    await deleteExpense.mutateAsync(id)
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Dépenses vs résultat (mois en cours)</h3>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
        >
          + Ajouter une dépense
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Dépenses ce mois</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">{formatMontant(expensesThisMonth)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Résultat net</p>
          <p className={`mt-1 text-xl font-semibold ${result >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatMontant(result)}
          </p>
        </div>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucune dépense enregistrée pour l'instant.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {recent.map((expense) => (
            <li key={expense.id} className="flex items-center gap-3 py-2 text-sm">
              <Badge tone={EXPENSE_CATEGORY_TONES[expense.categorie]}>
                {EXPENSE_CATEGORY_LABELS[expense.categorie]}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-neutral-700">{expense.libelle}</span>
              <span className="shrink-0 text-xs text-neutral-400">{formatDate(expense.date_depense)}</span>
              <span className="shrink-0 font-medium text-neutral-900">{formatMontant(expense.montant)}</span>
              <button
                type="button"
                onClick={() => handleDelete(expense.id, expense.libelle)}
                className="shrink-0 text-neutral-300 hover:text-red-600"
                aria-label="Supprimer"
              >
                ✕
              </button>
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
