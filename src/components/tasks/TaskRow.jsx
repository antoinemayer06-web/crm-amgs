import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { TASK_PRIORITE_LABELS, TASK_PRIORITE_TONES, isDatePassee } from '../../lib/constants'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : null)

export default function TaskRow({ task, onToggleDone, onEdit, onDelete }) {
  const done = task.statut === 'fait'
  const late = !done && isDatePassee(task.due_date)

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggleDone(task)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-chrome-light"
        aria-label={done ? 'Marquer à faire' : 'Marquer fait'}
      />

      <button type="button" onClick={() => onEdit(task)} className="min-w-0 flex-1 text-left">
        <p className={`truncate text-sm font-medium ${done ? 'text-ink-tertiary line-through' : 'text-ink'}`}>
          {task.titre}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-secondary">
          {task.due_date && (
            <span className={late ? 'font-medium text-red-400' : ''}>{formatDate(task.due_date)}</span>
          )}
          {task.company?.id && (
            <Link
              to={`/companies/${task.company.id}`}
              onClick={(event) => event.stopPropagation()}
              className="hover:underline"
            >
              {task.company.name}
            </Link>
          )}
        </div>
      </button>

      <Badge tone={TASK_PRIORITE_TONES[task.priorite]}>{TASK_PRIORITE_LABELS[task.priorite]}</Badge>

      <button
        type="button"
        onClick={() => onDelete(task)}
        className="shrink-0 text-xs text-ink-tertiary hover:text-red-500"
        aria-label="Supprimer la tâche"
      >
        Supprimer
      </button>
    </div>
  )
}
