import { useDensity } from '../../hooks/useDensity'
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_TONES, isDateUrgente } from '../../lib/constants'
import { getStepsCount } from '../../lib/projectUtils'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import DensityToggle from '../ui/DensityToggle'
import ProgressBar from '../ui/ProgressBar'

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function ListView({ projects, allSteps, onProjectClick, showClient = true }) {
  const [density, setDensity] = useDensity()
  const rowPadding = density === 'compact' ? 'py-1.5' : 'py-3'

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-chrome-dark bg-surface py-16 text-center">
        <p className="text-sm text-ink-tertiary">Aucun projet ne correspond à ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <DensityToggle density={density} onChange={setDensity} />
      </div>
      <div className="overflow-hidden rounded-xl border border-chrome-dark bg-surface">
      {projects.map((project, index) => {
        const urgent = isDateUrgente(project.date_livraison_prevue)
        const stepsCount = getStepsCount(allSteps, project.id)

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onProjectClick(project)}
            className={`flex w-full items-center gap-4 px-4 ${rowPadding} text-left transition-colors duration-150 hover:bg-surface-hover ${
              index > 0 ? 'border-t border-chrome-dark' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{project.nom}</p>
              {showClient && project.company && (
                <div className="mt-1 flex items-center gap-1.5">
                  <Avatar name={project.company.name} />
                  <span className="truncate text-xs text-ink-secondary">{project.company.name}</span>
                </div>
              )}
            </div>

            <div className="hidden w-40 shrink-0 sm:block">
              <ProgressBar done={stepsCount.done} total={stepsCount.total} />
            </div>

            <div className="flex w-44 shrink-0 items-center gap-1.5">
              <Badge tone={PROJECT_STATUT_TONES[project.statut]}>
                {PROJECT_STATUT_LABELS[project.statut]}
              </Badge>
              {project.archived && <Badge tone="neutral">Archivé</Badge>}
            </div>

            <div
              className={`w-24 shrink-0 text-right text-xs font-medium ${
                urgent ? 'text-red-600' : 'text-ink-secondary'
              }`}
            >
              {formatDate(project.date_livraison_prevue)}
            </div>
          </button>
        )
      })}
      </div>
    </div>
  )
}
