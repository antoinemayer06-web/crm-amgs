import { useMemo, useState } from 'react'
import ListView from '../projects/ListView'
import ProjectPanel from '../projects/ProjectPanel'
import { useAllProjectSteps, useProjectsByCompany } from '../../hooks/useProjects'

export default function ProjectsTab({ companyId }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
  const { data: allProjects, isLoading, isError, error } = useProjectsByCompany(companyId)
  const { data: allSteps } = useAllProjectSteps()

  const archivedCount = useMemo(
    () => (allProjects ?? []).filter((p) => p.archived).length,
    [allProjects],
  )
  const projects = useMemo(
    () => (allProjects ?? []).filter((p) => Boolean(p.archived) === showArchived),
    [allProjects, showArchived],
  )

  if (isLoading) return <p className="text-sm text-ink-secondary">Chargement…</p>
  if (isError) return <p className="text-sm text-red-600">Erreur : {error.message}</p>

  return (
    <div className="space-y-4">
      {archivedCount > 0 && (
        <div className="flex rounded-lg border border-chrome-dark bg-surface p-1 w-fit">
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
            Archivés ({archivedCount})
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="rounded-xl border border-chrome-dark bg-surface py-10 text-center text-sm text-ink-tertiary">
          {showArchived
            ? 'Aucun projet archivé pour cette entreprise.'
            : "Aucun projet lié à cette entreprise pour l'instant."}
        </p>
      ) : (
        <ListView
          projects={projects}
          allSteps={allSteps ?? []}
          showClient={false}
          onProjectClick={(project) => setSelectedProjectId(project.id)}
        />
      )}

      {selectedProjectId && (
        <ProjectPanel
          projectId={selectedProjectId}
          allSteps={allSteps ?? []}
          onClose={() => setSelectedProjectId(null)}
          onDeleted={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  )
}
