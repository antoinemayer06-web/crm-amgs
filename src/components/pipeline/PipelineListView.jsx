import { useMemo, useState } from 'react'
import { useDensity } from '../../hooks/useDensity'
import {
  STATUT_PROSPECT_TONES,
  TEMPERATURE_TONES,
  formatEnumLabel,
  isDatePassee,
} from '../../lib/constants'
import Badge from '../ui/Badge'
import DensityToggle from '../ui/DensityToggle'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

const SORT_OPTIONS = [
  { key: 'valeur_estimee', label: 'Valeur estimée' },
  { key: 'date_prochaine_action', label: 'Date de prochaine action' },
]

export default function PipelineListView({ companies, onCompanyClick }) {
  const [sortBy, setSortBy] = useState('date_prochaine_action')
  const [density, setDensity] = useDensity()
  const rowPadding = density === 'compact' ? 'py-1.5' : 'py-3'

  const sorted = useMemo(() => {
    const list = [...companies]
    if (sortBy === 'valeur_estimee') {
      list.sort((a, b) => (b.valeur_estimee ?? -1) - (a.valeur_estimee ?? -1))
    } else {
      list.sort((a, b) =>
        (a.date_prochaine_action ?? '9999').localeCompare(b.date_prochaine_action ?? '9999'),
      )
    }
    return list
  }, [companies, sortBy])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-3">
        <label className="text-sm text-ink-secondary">Trier par</label>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="input-chrome"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <DensityToggle density={density} onChange={setDensity} />
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-chrome-dark bg-surface py-16 text-center">
          <p className="text-sm text-ink-tertiary">Aucun prospect ne correspond à ces filtres.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-chrome-dark bg-surface">
          {sorted.map((company, index) => {
            const late = isDatePassee(company.date_prochaine_action)
            const dimmed = company.statut_prospect === 'refus'

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => onCompanyClick(company)}
                className={`flex w-full flex-col gap-2 px-4 ${rowPadding} text-left transition-colors duration-150 hover:bg-surface-hover md:flex-row md:items-center md:gap-4 ${
                  index > 0 ? 'border-t border-chrome-dark' : ''
                } ${dimmed ? 'opacity-50' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{company.name}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-secondary">
                    {company.sector || '—'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:contents">
                  <div className="w-40 shrink-0">
                    <Badge tone={STATUT_PROSPECT_TONES[company.statut_prospect]}>
                      {formatEnumLabel(company.statut_prospect)}
                    </Badge>
                  </div>

                  <div className="w-24 shrink-0">
                    {company.temperature && (
                      <Badge tone={TEMPERATURE_TONES[company.temperature]}>
                        {formatEnumLabel(company.temperature)}
                      </Badge>
                    )}
                  </div>

                  <div className="shrink-0 text-sm font-medium text-ink-secondary md:w-28 md:text-right">
                    {formatMontant(company.valeur_estimee)}
                  </div>

                  <div className="shrink-0 truncate text-sm text-ink-secondary md:w-48">
                    {company.prochaine_action || '—'}
                  </div>

                  <div
                    className={`shrink-0 text-xs font-medium md:w-24 md:text-right ${
                      late ? 'text-red-400' : 'text-ink-secondary'
                    }`}
                  >
                    {formatDate(company.date_prochaine_action)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
