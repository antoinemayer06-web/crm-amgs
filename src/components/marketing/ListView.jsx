import {
  MARKETING_ACTION_STATUS_TONES,
  MARKETING_ACTION_TYPE_TONES,
  formatEnumLabel,
} from '../../lib/constants'
import Badge from '../ui/Badge'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')

export default function ListView({ actions, onActionClick }) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
        <p className="text-sm text-neutral-400">Aucune action ne correspond à ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {actions.map((action, index) => {
        const cancelled = action.statut === 'annulé'
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onActionClick(action)}
            className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-150 hover:bg-neutral-50 ${
              index > 0 ? 'border-t border-neutral-100' : ''
            } ${cancelled ? 'opacity-50' : ''}`}
          >
            <div className="w-24 shrink-0 text-sm font-medium text-neutral-700">
              {formatDate(action.date_prevue)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-900">{action.titre}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-500">
                {action.campaign?.nom ?? 'Sans campagne'}
              </p>
            </div>

            <div className="w-36 shrink-0">
              <Badge tone={MARKETING_ACTION_TYPE_TONES[action.type]}>
                {formatEnumLabel(action.type)}
              </Badge>
            </div>

            <div className="w-28 shrink-0">
              <Badge tone={MARKETING_ACTION_STATUS_TONES[action.statut]}>
                {formatEnumLabel(action.statut)}
              </Badge>
            </div>
          </button>
        )
      })}
    </div>
  )
}
