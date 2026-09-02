import { useMemo } from 'react'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import CashKpiCard from '../components/dashboard/CashKpiCard'
import HoursComparisonChart from '../components/dashboard/HoursComparisonChart'
import KpiCard from '../components/dashboard/KpiCard'
import MarketingRecapCard from '../components/dashboard/MarketingRecapCard'
import PipelineFunnelChart from '../components/dashboard/PipelineFunnelChart'
import UrgentActionsWidget from '../components/dashboard/UrgentActionsWidget'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  getActiveProjectsCount,
  getCAThisMonth,
  getCashSummary,
  getConversionRate,
  getHoursComparison,
  getLateProjectsCount,
  getMarketingWeekCount,
  getPipelineFunnel,
  getPipelineValue,
  getRecentActivity,
  getUrgentItems,
} from '../lib/dashboardUtils'

const formatMontant = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} €`

function Section({ title, action, children }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardData()

  const kpis = useMemo(() => {
    if (!data) return null
    return {
      ca: getCAThisMonth(data.documents),
      cash: getCashSummary(data.documents),
      pipelineValue: getPipelineValue(data.companies),
      conversionRate: getConversionRate(data.companies),
      activeProjects: getActiveProjectsCount(data.projects),
      lateProjects: getLateProjectsCount(data.projects),
    }
  }, [data])

  const hoursData = useMemo(
    () => (data ? getHoursComparison(data.projects, data.steps, data.workLogs) : []),
    [data],
  )
  const pipelineFunnel = useMemo(() => (data ? getPipelineFunnel(data.companies) : []), [data])
  const urgentItems = useMemo(
    () => (data ? getUrgentItems(data.companies, data.projects, data.tasks) : []),
    [data],
  )
  const activity = useMemo(
    () =>
      data ? getRecentActivity(data.notes, data.documents, data.projects, data.companies) : [],
    [data],
  )
  const marketingWeekCount = useMemo(
    () => (data ? getMarketingWeekCount(data.marketingActions) : 0),
    [data],
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900">Dashboard</h2>

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {kpis && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="CA du mois" value={formatMontant(kpis.ca)} />
            <CashKpiCard
              facture={kpis.cash.facture}
              encaisse={kpis.cash.encaisse}
              restant={kpis.cash.restant}
            />
            <KpiCard label="Valeur du pipeline" value={formatMontant(kpis.pipelineValue)} />
            <KpiCard
              label="Taux de conversion"
              value={kpis.conversionRate == null ? '—' : `${kpis.conversionRate.toFixed(0)} %`}
              sublabel="Prospects créés ce mois-ci"
            />
            <KpiCard
              label="Projets actifs"
              value={kpis.activeProjects}
            />
            <KpiCard
              label="Projets en retard"
              value={kpis.lateProjects}
              tone={kpis.lateProjects > 0 ? 'critical' : 'good'}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Section title="Heures : prévu vs réel (projets actifs)">
              <HoursComparisonChart data={hoursData} />
            </Section>
            <Section title="Répartition du pipeline">
              <PipelineFunnelChart data={pipelineFunnel} />
            </Section>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Section title="Actions urgentes du jour">
                <UrgentActionsWidget items={urgentItems} />
              </Section>
            </div>
            <div className="lg:col-span-2">
              <Section title="Activité récente">
                <ActivityFeed events={activity} />
              </Section>
            </div>
            <div className="lg:col-span-1">
              <MarketingRecapCard count={marketingWeekCount} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
