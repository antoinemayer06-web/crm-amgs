import { useState } from 'react'
import KpiCard from '../dashboard/KpiCard'
import SiteVisitsChart from './SiteVisitsChart'
import { useSiteEvents } from '../../hooks/useSiteInternet'

const PERIODES = [
  { key: 'jour', label: "Aujourd'hui" },
  { key: 'semaine', label: '7 derniers jours' },
  { key: 'mois', label: '30 derniers jours' },
]

export default function SiteOverviewTab() {
  const [periode, setPeriode] = useState('semaine')
  const { data, isLoading, isError, error } = useSiteEvents(periode)

  return (
    <div className="space-y-6">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-chrome-dark p-1">
        {PERIODES.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPeriode(p.key)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              periode === p.key ? 'bg-surface-hover text-ink' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
      {isError && <p className="text-sm font-medium text-red-400">Erreur : {error.message}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <KpiCard label="Visites totales" value={data.compteurs.page_view} />
            <KpiCard label="Visiteurs uniques" value={data.visiteursUniques} />
            <KpiCard label="Clics Calendly" value={data.compteurs.clic_calendly} />
            <KpiCard label="Clics email" value={data.compteurs.clic_email} />
            <KpiCard label="Clics LinkedIn" value={data.compteurs.clic_linkedin} />
            <KpiCard label="Clics WhatsApp" value={data.compteurs.clic_whatsapp} />
          </div>

          <div className="card-chrome-lit card-glass rounded-xl p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink">Évolution des visites</h3>
            <SiteVisitsChart data={data.series} />
          </div>

          <div className="card-chrome-lit card-glass rounded-xl p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink">Pages les plus visitées</h3>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-ink-secondary">Aucune visite sur cette période.</p>
            ) : (
              <ul className="divide-y divide-chrome-dark">
                {data.topPages.map((row, index) => (
                  <li key={row.page} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-5 shrink-0 text-ink-tertiary">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-ink">{row.page}</span>
                    <span className="shrink-0 tabular-nums text-ink-secondary">{row.vues} vues</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
