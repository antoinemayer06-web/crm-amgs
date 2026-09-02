import { useEffect, useMemo, useState } from 'react'
import ExpensesPanel from '../components/finance/ExpensesPanel'
import FinanceChart from '../components/finance/FinanceChart'
import FinanceGoalJar from '../components/finance/FinanceGoalJar'
import { useFinanceData } from '../hooks/useFinanceData'
import { useUpdateFinanceGoal } from '../hooks/useFinance'
import { useAuth } from '../lib/AuthContext'
import {
  currentMonthKey,
  getCAForMonth,
  getEncaisseForMonth,
  getExpensesForMonth,
  getResultatPrevu,
  getResultatRealise,
} from '../lib/dashboardUtils'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function shiftMonthKey(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function FinancePage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useFinanceData()
  const updateFinanceGoal = useUpdateFinanceGoal()
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [objectif, setObjectif] = useState('')

  useEffect(() => {
    setObjectif(data?.financeGoal?.objectif_resultat_mensuel ?? 0)
  }, [data?.financeGoal])

  const kpis = useMemo(() => {
    if (!data) return null
    const ca = getCAForMonth(data.documents, monthKey)
    const encaisse = getEncaisseForMonth(data.cashCollections, monthKey)
    const depenses = getExpensesForMonth(data.expenses, monthKey)
    return {
      ca,
      encaisse,
      depenses,
      resultatPrevu: getResultatPrevu(ca, depenses),
      resultatRealise: getResultatRealise(encaisse, depenses),
    }
  }, [data, monthKey])

  function handleObjectifBlur() {
    const value = Number(objectif) || 0
    if (value === (data?.financeGoal?.objectif_resultat_mensuel ?? 0)) return
    updateFinanceGoal.mutate({ ownerId: user.id, objectifResultatMensuel: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Finance</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthKey((current) => shiftMonthKey(current, -1))}
            className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
            aria-label="Mois précédent"
          >
            ←
          </button>
          <span className="min-w-32 text-center text-sm font-medium capitalize text-ink">
            {formatMonthLabel(monthKey)}
          </span>
          <button
            type="button"
            onClick={() => setMonthKey((current) => shiftMonthKey(current, 1))}
            className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
            aria-label="Mois suivant"
          >
            →
          </button>
          {monthKey !== currentMonthKey() && (
            <button
              type="button"
              onClick={() => setMonthKey(currentMonthKey())}
              className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-xs text-ink-secondary hover:bg-surface-hover"
            >
              Mois en cours
            </button>
          )}
        </div>
      </div>

      {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {kpis && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="card-glass rounded-xl p-4 xl:col-span-2">
              <h3 className="mb-3 text-sm font-semibold text-ink">Vue d'ensemble du mois</h3>
              <FinanceChart
                caThisMonth={kpis.ca}
                encaisseThisMonth={kpis.encaisse}
                expensesThisMonth={kpis.depenses}
                resultatPrevu={kpis.resultatPrevu}
                resultatRealise={kpis.resultatRealise}
              />

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-chrome-dark pt-4">
                <div>
                  <p className="text-xs font-medium text-ink-tertiary">Résultat prévu</p>
                  <p
                    className={`mt-1 text-xl font-semibold ${
                      kpis.resultatPrevu >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatMontant(kpis.resultatPrevu)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-tertiary">CA facturé − dépenses</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink-tertiary">Résultat réalisé</p>
                  <p
                    className={`mt-1 text-xl font-semibold ${
                      kpis.resultatRealise >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatMontant(kpis.resultatRealise)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-tertiary">Encaissé (réel) − dépenses</p>
                </div>
              </div>
            </div>

            <div className="card-glass rounded-xl p-4">
              <h3 className="mb-3 text-center text-sm font-semibold text-ink">
                Objectif de résultat mensuel
              </h3>
              <FinanceGoalJar objectif={Number(objectif) || 0} realise={kpis.resultatRealise} />
              <div className="mt-4 space-y-1">
                <label htmlFor="objectif_resultat" className="block text-xs text-ink-secondary">
                  Objectif mensuel (€)
                </label>
                <input
                  id="objectif_resultat"
                  type="number"
                  step="1"
                  value={objectif}
                  onChange={(event) => setObjectif(event.target.value)}
                  onBlur={handleObjectifBlur}
                  className="w-full rounded-md border border-chrome-dark px-3 py-1.5 text-sm focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
                />
              </div>
            </div>
          </div>

          <ExpensesPanel expenses={data.expenses} monthKey={monthKey} />
        </>
      )}
    </div>
  )
}
