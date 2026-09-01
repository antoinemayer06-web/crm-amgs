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
      <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
        <p className="text-sm text-neutral-400">Aucun projet ne correspond à ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <div className="min-w-[900px]">
        {/* Axe temporel */}
        <div className="relative flex border-b border-neutral-200 pl-48">
          <div className="relative h-8 flex-1">
            {months.map((month) => (
              <div
                key={month.toISOString()}
                className="absolute top-0 h-full border-l border-neutral-100 pl-2 text-xs text-neutral-400"
                style={{ left: `${toPercent(month)}%` }}
              >
                {month.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
              </div>
            ))}
          </div>
        </div>

        {/* Lignes par client */}
        <div className="divide-y divide-neutral-100">
          {groups.map((group) => (
            <div key={group.client?.id ?? 'sans-client'} className="flex">
              <div className="flex w-48 shrink-0 items-center gap-2 px-3 py-3">
                <Avatar name={group.client?.name} />
                <span className="truncate text-sm text-neutral-700">
                  {group.client?.name ?? '—'}
                </span>
              </div>
              <div className="relative flex-1 space-y-1 py-3 pr-4">
                {months.map((month) => (
                  <div
                    key={month.toISOString()}
                    className="absolute top-0 h-full border-l border-neutral-50"
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
                                  : 'bg-neutral-200'
                          } ${isHovered ? 'shadow-md ring-2 ring-neutral-300' : ''}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <span className="block truncate px-2 py-1 text-xs font-medium text-neutral-700">
                            {project.nom}
                          </span>
                        </div>

                        {isHovered && (
                          <div
                            className="absolute top-7 z-10 w-56 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg"
                            style={{ left: `${left}%` }}
                          >
                            <p className="text-sm font-medium text-neutral-900">{project.nom}</p>
                            <p className="mt-1 text-xs text-neutral-500">{project.company?.name}</p>
                            <p className="mt-1 text-xs text-neutral-500">
                              {formatDate(project.date_debut)} → {formatDate(project.date_livraison_prevue)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-neutral-700">
                              {PROJECT_STATUT_LABELS[project.statut]}
                            </p>
                          </div>
                        )}
                      </div>

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
                                done ? 'bg-neutral-100' : 'bg-neutral-200'
                              }`}
                              style={{ left: `${stepLeft}%`, width: `${stepWidth}%` }}
                            >
                              <span
                                className={`block truncate px-1.5 text-[10px] leading-4 ${
                                  done ? 'text-neutral-400 line-through' : 'text-neutral-600'
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
