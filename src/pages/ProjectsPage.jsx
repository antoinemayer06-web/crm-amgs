import { useMemo, useState } from 'react'
import KanbanView from '../components/projects/KanbanView'
import ListView from '../components/projects/ListView'
import PlanningView from '../components/projects/PlanningView'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectPanel from '../components/projects/ProjectPanel'
import Modal from '../components/ui/Modal'
import { useCreateProject, useAllProjectSteps, useProjects, useUpdateProject } from '../hooks/useProjects'
import { isDatePassee } from '../lib/constants'

const VIEWS = [
  { key: 'kanban', label: 'Kanban' },
  { key: 'planning', label: 'Planning' },
  { key: 'list', label: 'Liste' },
]

const emptyFilters = { statut: '', companyId: '', lateOnly: false }

export default function ProjectsPage() {
  const [view, setView] = useState('kanban')
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [creating, setCreating] = useState(false)

  const { data: allProjects, isLoading, isError, error } = useProjects({
    statut: filters.statut,
    companyId: filters.companyId,
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Projets / Livraison</h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          + Nouveau projet
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <ProjectFilters filters={filters} onChange={setFilters} />

        <div className="flex shrink-0 rounded-lg border border-neutral-200 bg-white p-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                view === v.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
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
          {view === 'planning' && <PlanningView projects={projects} />}
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
          onClose={() => setSelectedProjectId(null)}
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
