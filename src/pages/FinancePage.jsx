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
        <h2 className="text-xl font-semibold text-neutral-900">Finance</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthKey((current) => shiftMonthKey(current, -1))}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
            aria-label="Mois précédent"
          >
            ←
          </button>
          <span className="min-w-32 text-center text-sm font-medium capitalize text-neutral-900">
            {formatMonthLabel(monthKey)}
          </span>
          <button
            type="button"
            onClick={() => setMonthKey((current) => shiftMonthKey(current, 1))}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
            aria-label="Mois suivant"
          >
            →
          </button>
          {monthKey !== currentMonthKey() && (
            <button
              type="button"
              onClick={() => setMonthKey(currentMonthKey())}
              className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100"
            >
              Mois en cours
            </button>
          )}
        </div>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {kpis && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm xl:col-span-2">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">Vue d'ensemble du mois</h3>
              <FinanceChart
                caThisMonth={kpis.ca}
                encaisseThisMonth={kpis.encaisse}
                expensesThisMonth={kpis.depenses}
                resultatPrevu={kpis.resultatPrevu}
                resultatRealise={kpis.resultatRealise}
              />

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Résultat prévu</p>
                  <p
                    className={`mt-1 text-xl font-semibold ${
                      kpis.resultatPrevu >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatMontant(kpis.resultatPrevu)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">CA facturé − dépenses</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Résultat réalisé</p>
                  <p
                    className={`mt-1 text-xl font-semibold ${
                      kpis.resultatRealise >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {formatMontant(kpis.resultatRealise)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">Encaissé (réel) − dépenses</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-center text-sm font-semibold text-neutral-900">
                Objectif de résultat mensuel
              </h3>
              <FinanceGoalJar objectif={Number(objectif) || 0} realise={kpis.resultatRealise} />
              <div className="mt-4 space-y-1">
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
                  className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
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
