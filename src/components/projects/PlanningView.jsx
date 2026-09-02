import { useMemo, useState } from 'react'
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_TONES } from '../../lib/constants'
import { getStepsForProject } from '../../lib/projectUtils'
import Avatar from '../ui/Avatar'

const DAY = 1000 * 60 * 60 * 24
const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'

function groupByClient(projects) {
  const groups = new Map()
  for (const project of projects) {
    const key = project.company?.id ?? 'sans-client'
    if (!groups.has(key)) {
      groups.set(key, { client: project.company, projects: [] })
    }
    groups.get(key).projects.push(project)
  }
  return Array.from(groups.values())
}

export default function PlanningView({ projects, allSteps = [] }) {
  const [hovered, setHovered] = useState(null)

  const { rangeStart, rangeEnd, months } = useMemo(() => {
    const dates = projects
      .flatMap((project) => [
        project.date_debut,
        project.date_livraison_prevue,
        ...getStepsForProject(allSteps, project.id).flatMap((s) => [s.date_debut, s.date_fin]),
      ])
      .filter(Boolean)
      .map((d) => new Date(d))

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let start = dates.length ? new Date(Math.min(...dates)) : today
    let end = dates.length ? new Date(Math.max(...dates)) : new Date(today.getTime() + 30 * DAY)

    // Un peu de marge de chaque côté pour la lisibilité.
    start = new Date(start.getTime() - 7 * DAY)
    end = new Date(end.getTime() + 7 * DAY)

    const monthMarkers = []
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
    while (cursor <= end) {
      monthMarkers.push(new Date(cursor))
      cursor.setMonth(cursor.getMonth() + 1)
    }

    return { rangeStart: start, rangeEnd: end, months: monthMarkers }
  }, [projects, allSteps])

  const totalSpan = rangeEnd - rangeStart || 1
  const toPercent = (date) => ((date - rangeStart) / totalSpan) * 100

  const groups = useMemo(() => groupByClient(projects), [projects])

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-chrome-dark bg-surface py-16 text-center">
        <p className="text-sm text-ink-tertiary">Aucun projet ne correspond à ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-chrome-dark bg-surface">
      <div className="min-w-[900px]">
        {/* Axe temporel */}
        <div className="relative flex border-b border-chrome-dark pl-48">
          <div className="relative h-8 flex-1">
            {months.map((month) => (
              <div
                key={month.toISOString()}
                className="absolute top-0 h-full border-l border-chrome-dark pl-2 text-xs text-ink-tertiary"
                style={{ left: `${toPercent(month)}%` }}
              >
                {month.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
              </div>
            ))}
          </div>
        </div>

        {/* Lignes par client */}
        <div className="divide-y divide-chrome-dark">
          {groups.map((group) => (
            <div key={group.client?.id ?? 'sans-client'} className="flex">
              <div className="flex w-48 shrink-0 items-center gap-2 px-3 py-3">
                <Avatar name={group.client?.name} />
                <span className="truncate text-sm text-ink-secondary">
                  {group.client?.name ?? '—'}
                </span>
              </div>
              <div className="relative flex-1 space-y-1 py-3 pr-4">
                {months.map((month) => (
                  <div
                    key={month.toISOString()}
                    className="absolute top-0 h-full border-l border-chrome-dark"
                    style={{ left: `${toPercent(month)}%` }}
                  />
                ))}
                {group.projects.map((project) => {
                  const start = project.date_debut ? new Date(project.date_debut) : rangeStart
                  const end = project.date_livraison_prevue
                    ? new Date(project.date_livraison_prevue)
                    : new Date(start.getTime() + DAY)
                  const left = toPercent(start)
                  const width = Math.max(toPercent(end) - left, 1.5)
                  const isHovered = hovered === project.id
                  const steps = getStepsForProject(allSteps, project.id).filter(
                    (s) => s.date_debut || s.date_fin,
                  )

                  return (
                    <div key={project.id} className="relative">
                      <div className="relative h-6">
                        <div
                          onMouseEnter={() => setHovered(project.id)}
                          onMouseLeave={() => setHovered(null)}
                          className={`absolute h-6 rounded-md transition-shadow duration-150 ${
                            PROJECT_STATUT_TONES[project.statut] === 'green'
                              ? 'bg-green-200'
                              : PROJECT_STATUT_TONES[project.statut] === 'amber'
                                ? 'bg-amber-200'
                                : PROJECT_STATUT_TONES[project.statut] === 'blue'
                                  ? 'bg-blue-200'
                                  : 'bg-surface-hover'
                          } ${isHovered ? 'shadow-md ring-2 ring-chrome-mid' : ''}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <span className="block truncate px-2 py-1 text-xs font-medium text-ink-secondary">
                            {project.nom}
                          </span>
                        </div>

                        {isHovered && (
                          <div
                            className="absolute top-7 z-10 w-56 rounded-lg border border-chrome-dark bg-surface p-3 shadow-lg"
                            style={{ left: `${left}%` }}
                          >
                            <p className="text-sm font-medium text-ink">{project.nom}</p>
                            <p className="mt-1 text-xs text-ink-secondary">{project.company?.name}</p>
                            <p className="mt-1 text-xs text-ink-secondary">
                              {formatDate(project.date_debut)} → {formatDate(project.date_livraison_prevue)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-ink-secondary">
                              {PROJECT_STATUT_LABELS[project.statut]}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Connecteurs reliant la barre du projet à chacune de ses tâches */}
                      {steps.length > 0 && (
                        <div className="pointer-events-none absolute inset-0">
                          {steps.map((step, index) => {
                            const stepStart = step.date_debut
                              ? new Date(step.date_debut)
                              : new Date(step.date_fin)
                            const stepLeft = toPercent(stepStart)
                            const rowCenter = 24 + index * 16 + 8
                            const connLeft = Math.min(left, stepLeft)
                            const connWidth = Math.max(Math.abs(stepLeft - left), 0.3)
                            const pointsRight = stepLeft >= left

                            return (
                              <div key={step.id}>
                                <div
                                  className="absolute w-px bg-surface-hover"
                                  style={{ left: `${left}%`, top: '24px', height: `${rowCenter - 24}px` }}
                                />
                                <div
                                  className="absolute h-px bg-surface-hover"
                                  style={{ left: `${connLeft}%`, width: `${connWidth}%`, top: `${rowCenter}px` }}
                                />
                                <div
                                  className="absolute h-0 w-0"
                                  style={{
                                    top: `${rowCenter - 3}px`,
                                    left: pointsRight ? `calc(${stepLeft}% - 4px)` : `calc(${stepLeft}% + 4px)`,
                                    borderTop: '3px solid transparent',
                                    borderBottom: '3px solid transparent',
                                    borderLeft: pointsRight ? '4px solid #d4d4d4' : undefined,
                                    borderRight: pointsRight ? undefined : '4px solid #d4d4d4',
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {steps.map((step) => {
                        const stepStart = step.date_debut ? new Date(step.date_debut) : new Date(step.date_fin)
                        const stepEnd = step.date_fin ? new Date(step.date_fin) : new Date(step.date_debut)
                        const stepLeft = toPercent(stepStart)
                        const stepWidth = Math.max(toPercent(stepEnd) - stepLeft, 1)
                        const done = step.statut === 'fait'

                        return (
                          <div key={step.id} className="relative h-4">
                            <div
                              className={`absolute h-4 rounded ${
                                done ? 'bg-surface-hover' : 'bg-surface-hover'
                              }`}
                              style={{ left: `${stepLeft}%`, width: `${stepWidth}%` }}
                            >
                              <span
                                className={`block truncate px-1.5 text-[10px] leading-4 ${
                                  done ? 'text-ink-tertiary line-through' : 'text-ink-secondary'
                                }`}
                              >
                                {step.titre}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
