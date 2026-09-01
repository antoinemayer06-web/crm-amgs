import { PROJECT_STATUT_LABELS, PROJECT_STATUT_TONES, isDateUrgente } from '../../lib/constants'
import { getProjectHealth } from '../../lib/projectUtils'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : null

const DOT_COLORS = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
}

function HealthIndicator({ project }) {
  const health = getProjectHealth(project)

  if (health.type === 'clock') {
    return (
      <span title={health.label} className="text-sm leading-none text-neutral-400">
        🕐
      </span>
    )
  }

  return (
    <span
      title={health.label}
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_COLORS[health.color]}`}
    />
  )
}

export default function ProjectCard({
  project,
  stepsCount,
  showClient = true,
  showStatus = false,
  showHealth = false,
  onClick,
  dragHandleProps,
  isDragging = false,
  style,
}) {
  const urgent = isDateUrgente(project.date_livraison_prevue)

  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      {...dragHandleProps}
      className={`w-full rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
        isDragging ? 'rotate-2 opacity-90 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-900">{project.nom}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {showStatus && (
            <Badge tone={PROJECT_STATUT_TONES[project.statut]}>
              {PROJECT_STATUT_LABELS[project.statut]}
            </Badge>
          )}
          {showHealth && <HealthIndicator project={project} />}
        </div>
      </div>

      {showClient && project.company && (
        <div className="mt-2 flex items-center gap-1.5">
          <Avatar name={project.company.name} />
          <span className="truncate text-xs text-neutral-500">{project.company.name}</span>
        </div>
      )}

      <div className="mt-3">
        <ProgressBar done={stepsCount.done} total={stepsCount.total} />
      </div>

      {project.date_livraison_prevue && (
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              urgent ? 'text-red-600' : 'text-neutral-400'
            }`}
          >
            {urgent && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
            {formatDate(project.date_livraison_prevue)}
          </span>
        </div>
      )}
    </button>
  )
}
