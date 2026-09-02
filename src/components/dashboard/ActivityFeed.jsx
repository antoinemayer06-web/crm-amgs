import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../../lib/dashboardUtils'
import { IconCompanies, IconDocument, IconNote, IconProjects } from '../ui/icons'

const TYPE_ICON = { note: IconNote, document: IconDocument, project: IconProjects, company: IconCompanies }

export default function ActivityFeed({ events }) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-tertiary">Aucune activité récente.</p>
  }

  return (
    <ul className="space-y-1">
      {events.map((event) => {
        const Icon = TYPE_ICON[event.type]
        const row = (
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-tertiary" />
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
