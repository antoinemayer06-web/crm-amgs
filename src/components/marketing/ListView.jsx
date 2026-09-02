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
      <div className="rounded-xl border border-chrome-dark bg-surface py-16 text-center">
        <p className="text-sm text-ink-tertiary">Aucune action ne correspond à ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-chrome-dark bg-surface">
      {actions.map((action, index) => {
        const cancelled = action.statut === 'annulé'
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onActionClick(action)}
            className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-hover ${
              index > 0 ? 'border-t border-chrome-dark' : ''
            } ${cancelled ? 'opacity-50' : ''}`}
          >
            <div className="w-24 shrink-0 text-sm font-medium text-ink-secondary">
              {formatDate(action.date_prevue)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{action.titre}</p>
              <p className="mt-0.5 truncate text-xs text-ink-secondary">
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
