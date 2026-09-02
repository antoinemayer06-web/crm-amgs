import { Link } from 'react-router-dom'
import { isDatePassee } from '../../lib/constants'
import { IconCheck, IconPerson, IconProjects } from '../ui/icons'

const KIND_ICON = { prospect: IconPerson, project: IconProjects, task: IconCheck }

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

export default function UrgentActionsWidget({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-chrome-dark py-10 text-center">
        <IconCheck className="h-6 w-6 text-ink-tertiary" />
        <p className="text-sm font-medium text-ink-secondary">
          Rien d'urgent aujourd'hui, tout est sous contrôle.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-chrome-dark overflow-hidden rounded-lg border border-chrome-dark">
      {items.map((item) => {
        const late = isDatePassee(item.date)
        const Icon = KIND_ICON[item.kind]
        const content = (
          <>
            <Icon className="h-4 w-4 shrink-0 text-ink-tertiary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{item.label}</p>
              <p className="truncate text-xs text-ink-secondary">{item.sub}</p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium ${late ? 'text-red-400' : 'text-ink-secondary'}`}
            >
              {formatDate(item.date)}
            </span>
          </>
        )

        return item.link ? (
          <Link
            key={item.id}
            to={item.link}
            className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface-hover"
          >
            {content}
          </Link>
        ) : (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3 opacity-70">
            {content}
          </div>
        )
      })}
    </div>
  )
}
