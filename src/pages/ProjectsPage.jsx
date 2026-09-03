import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import KanbanView from '../components/projects/KanbanView'
import ListView from '../components/projects/ListView'
import PlanningView from '../components/projects/PlanningView'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectPanel from '../components/projects/ProjectPanel'
import Modal from '../components/ui/Modal'
import { SkeletonRows } from '../components/ui/Skeleton'
import { useCreateProject, useAllProjectSteps, useProjects, useUpdateProject } from '../hooks/useProjects'
import { isDatePassee } from '../lib/constants'
import { useIsMobile } from '../hooks/useIsMobile'

const VIEWS = [
  { key: 'kanban', label: 'Kanban' },
  { key: 'planning', label: 'Planning' },
  { key: 'list', label: 'Liste' },
]

const emptyFilters = { statut: '', companyId: '', lateOnly: false }

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()
  // Le Planning (Gantt) est illisible sur petit écran et repose sur du
  // survol (hover) qui n'existe pas au tactile : on démarre en Liste sur
  // mobile et on masque l'onglet Planning.
  const [view, setView] = useState(() => (isMobile ? 'list' : 'kanban'))
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const visibleViews = isMobile ? VIEWS.filter((v) => v.key !== 'planning') : VIEWS

  // Permet de deep-linker vers un projet précis (ex: depuis le dashboard)
  // via /projects?open=<id>.
  useEffect(() => {
    const openId = searchParams.get('open')
    if (openId) setSelectedProjectId(openId)
    if (searchParams.get('create')) setCreating(true)
  }, [searchParams])

  useEffect(() => {
    if (isMobile && view === 'planning') setView('list')
  }, [isMobile, view])

  // Un projet archivé disparaît toujours du Kanban et du Planning ; seule
  // la vue Liste peut basculer pour les consulter.
  const archived = view === 'list' && showArchived

  const { data: allProjects, isLoading, isError, error } = useProjects({
    statut: filters.statut,
    companyId: filters.companyId,
    archived,
  })
  const { data: allSteps } = useAllProjectSteps()
  const updateProject = useUpdateProject()
  const createProject = useCreateProject()

  const projects = useMemo(() => {
    if (!allProjects) return []
    if (!filters.lateOnly) return allProjects
    return allProjects.filter(
      (project) => project.statut !== 'payé' && isDatePassee(project.date_livraison_prevue),
    )
  }, [allProjects, filters.lateOnly])

  function handleStatusChange(projectId, statut) {
    updateProject.mutate({ id: projectId, values: { statut } })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Projets / Livraison</h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="btn-primary"
        >
          + Nouveau projet
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ProjectFilters filters={filters} onChange={setFilters} />

        <div className="flex shrink-0 items-center gap-3">
          {view === 'list' && (
            <div className="flex rounded-lg border border-chrome-dark bg-surface p-1">
              <button
                type="button"
                onClick={() => setShowArchived(false)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  !showArchived ? 'bg-surface-hover text-ink' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                Actifs
              </button>
              <button
                type="button"
                onClick={() => setShowArchived(true)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  showArchived ? 'bg-surface-hover text-ink' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                Archivés
              </button>
            </div>
          )}

          <div className="flex rounded-lg border border-chrome-dark bg-surface p-1">
            {visibleViews.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setView(v.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  view === v.key
                    ? 'bg-surface-hover text-ink'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="card-glass overflow-hidden rounded-xl">
          <SkeletonRows count={6} />
        </div>
      )}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {!isLoading && !isError && (
        <div className="animate-[fadein_150ms_ease-out]" key={view}>
          {view === 'kanban' && (
            <KanbanView
              projects={projects}
              allSteps={allSteps ?? []}
              onProjectClick={(project) => setSelectedProjectId(project.id)}
              onStatusChange={handleStatusChange}
            />
          )}
          {view === 'planning' && <PlanningView projects={projects} allSteps={allSteps ?? []} />}
          {view === 'list' && (
            <ListView
              projects={projects}
              allSteps={allSteps ?? []}
              onProjectClick={(project) => setSelectedProjectId(project.id)}
            />
          )}
        </div>
      )}

      {selectedProjectId && (
        <ProjectPanel
          projectId={selectedProjectId}
          allSteps={allSteps ?? []}
          onClose={() => {
            setSelectedProjectId(null)
            if (searchParams.get('open')) {
              searchParams.delete('open')
              setSearchParams(searchParams, { replace: true })
            }
          }}
          onDeleted={() => setSelectedProjectId(null)}
        />
      )}

      {creating && (
        <Modal title="Nouveau projet" onClose={() => setCreating(false)}>
          <ProjectForm
            submitting={createProject.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await createProject.mutateAsync(values)
              setCreating(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
