import { TEMPERATURE_TONES, formatEnumLabel, isDatePassee } from '../../lib/constants'
import Badge from '../ui/Badge'

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : null
const formatMontant = (value) =>
  value == null ? null : `${Number(value).toLocaleString('fr-FR')} €`

export default function ProspectCard({
  company,
  onClick,
  dragHandleProps,
  isDragging = false,
  dimmed = false,
  style,
}) {
  const late = isDatePassee(company.date_prochaine_action)

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      {...dragHandleProps}
      className={`w-full rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
        isDragging ? 'rotate-2 opacity-90 shadow-lg' : ''
      } ${dimmed ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-900">{company.name}</p>
        {company.temperature && (
          <Badge tone={TEMPERATURE_TONES[company.temperature]}>
            {formatEnumLabel(company.temperature)}
          </Badge>
        )}
      </div>

      {company.sector && <p className="mt-1 text-xs text-neutral-500">{company.sector}</p>}

      {company.valeur_estimee != null && (
        <p className="mt-2 text-sm font-semibold text-neutral-900">
          {formatMontant(company.valeur_estimee)}
        </p>
      )}

      {company.prochaine_action && (
        <div className="mt-2 border-t border-neutral-100 pt-2">
          <p className="truncate text-xs text-neutral-600">{company.prochaine_action}</p>
          {company.date_prochaine_action && (
            <span
              className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                late ? 'text-red-600' : 'text-neutral-400'
              }`}
            >
              {late && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
              {formatDate(company.date_prochaine_action)}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
