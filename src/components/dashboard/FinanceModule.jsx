import { useEffect, useMemo, useState } from 'react'
import { useCreateExpense, useDeleteExpense, useFinanceGoal, useUpdateFinanceGoal } from '../../hooks/useExpenses'
import { useAuth } from '../../lib/AuthContext'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_TONES } from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import ExpenseForm from './ExpenseForm'
import FinanceChart from './FinanceChart'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

export default function FinanceModule({
  expenses,
  caThisMonth,
  encaisseThisMonth,
  expensesThisMonth,
  resultatPrevu,
  resultatRealise,
}) {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()
  const { data: financeGoal } = useFinanceGoal()
  const updateFinanceGoal = useUpdateFinanceGoal()

  const [objectif, setObjectif] = useState('')

  useEffect(() => {
    setObjectif(financeGoal?.objectif_resultat_mensuel ?? 0)
  }, [financeGoal])

  const recent = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date_depense) - new Date(a.date_depense)).slice(0, 6),
    [expenses],
  )

  const ecart = resultatRealise - Number(objectif || 0)

  async function handleDelete(id, libelle) {
    if (!window.confirm(`Supprimer la dépense « ${libelle} » ?`)) return
    await deleteExpense.mutateAsync(id)
  }

  function handleObjectifBlur() {
    const value = Number(objectif) || 0
    if (value === (financeGoal?.objectif_resultat_mensuel ?? 0)) return
    updateFinanceGoal.mutate({ ownerId: user.id, objectifResultatMensuel: value })
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Finance (mois en cours)</h3>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
        >
          + Ajouter une dépense
        </button>
      </div>

      <FinanceChart
        caThisMonth={caThisMonth}
        encaisseThisMonth={encaisseThisMonth}
        expensesThisMonth={expensesThisMonth}
        resultatPrevu={resultatPrevu}
        resultatRealise={resultatRealise}
      />

      <div className="my-4 grid grid-cols-2 gap-4 border-y border-neutral-100 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Résultat prévu</p>
          <p className={`mt-1 text-xl font-semibold ${resultatPrevu >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatMontant(resultatPrevu)}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">CA facturé − dépenses</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Résultat réalisé</p>
          <p className={`mt-1 text-xl font-semibold ${resultatRealise >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatMontant(resultatRealise)}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">Encaissé − dépenses</p>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-neutral-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Objectif de résultat</p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label htmlFor="objectif_resultat" className="block text-xs text-neutral-500">
              Objectif mensuel (€)
            </label>
            <input
              id="objectif_resultat"
              type="number"
              step="1"
              value={objectif}
              onChange={(event) => setObjectif(event.target.value)}
              onBlur={handleObjectifBlur}
              className="w-40 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Écart (réalisé − objectif)</p>
            <p className={`text-lg font-semibold ${ecart >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {ecart >= 0 ? '+' : ''}
              {formatMontant(ecart)}
            </p>
          </div>
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
              {expense.recurrence_frequence && (
                <span className="shrink-0 text-xs text-neutral-400" title="Dépense récurrente">
                  ↻
                </span>
              )}
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
