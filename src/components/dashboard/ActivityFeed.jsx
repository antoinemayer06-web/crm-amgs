import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../lib/dashboardUtils'

const TYPE_ICON = { note: '📝', document: '📄', project: '📁', company: '🏢' }

export default function ActivityFeed({ events }) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-tertiary">Aucune activité récente.</p>
  }

  return (
    <ul className="space-y-1">
      {events.map((event) => {
        const row = (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-base">{TYPE_ICON[event.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-secondary">{event.label}</p>
              <p className="text-xs text-ink-tertiary">{formatRelativeTime(event.timestamp)}</p>
            </div>
          </div>
        )

        return (
          <li key={event.id}>
            {event.link ? (
              <Link
                to={event.link}
                className="-mx-2 block rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-surface-hover"
              >
                {row}
              </Link>
            ) : (
              <div className="-mx-2 px-2 py-1.5">{row}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
