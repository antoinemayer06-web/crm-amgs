import { useMemo, useState } from 'react'
import {
  STATUT_PROSPECT_TONES,
  TEMPERATURE_TONES,
  formatEnumLabel,
  isDatePassee,
} from '../../lib/constants'
import Badge from '../ui/Badge'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

const SORT_OPTIONS = [
  { key: 'valeur_estimee', label: 'Valeur estimée' },
  { key: 'date_prochaine_action', label: 'Date de prochaine action' },
]

export default function PipelineListView({ companies, onCompanyClick }) {
  const [sortBy, setSortBy] = useState('date_prochaine_action')

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
      <div className="flex items-center justify-end gap-2">
        <label className="text-sm text-neutral-500">Trier par</label>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">Aucun prospect ne correspond à ces filtres.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {sorted.map((company, index) => {
            const late = isDatePassee(company.date_prochaine_action)
            const dimmed = company.statut_prospect === 'refus'

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => onCompanyClick(company)}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-150 hover:bg-neutral-50 ${
                  index > 0 ? 'border-t border-neutral-100' : ''
                } ${dimmed ? 'opacity-50' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{company.name}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {company.sector || '—'}
                  </p>
                </div>

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

                <div className="w-28 shrink-0 text-right text-sm font-medium text-neutral-700">
                  {formatMontant(company.valeur_estimee)}
                </div>

                <div className="w-48 shrink-0 truncate text-sm text-neutral-600">
                  {company.prochaine_action || '—'}
                </div>

                <div
                  className={`w-24 shrink-0 text-right text-xs font-medium ${
                    late ? 'text-red-600' : 'text-neutral-500'
                  }`}
                >
                  {formatDate(company.date_prochaine_action)}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
