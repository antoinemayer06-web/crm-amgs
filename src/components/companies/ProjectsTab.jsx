import { useState } from 'react'
import ListView from '../projects/ListView'
import ProjectPanel from '../projects/ProjectPanel'
import { useAllProjectSteps, useProjectsByCompany } from '../../hooks/useProjects'

export default function ProjectsTab({ companyId }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const { data: projects, isLoading, isError, error } = useProjectsByCompany(companyId)
  const { data: allSteps } = useAllProjectSteps()

  if (isLoading) return <p className="text-sm text-neutral-500">Chargement…</p>
  if (isError) return <p className="text-sm text-red-600">Erreur : {error.message}</p>

  return (
    <>
      {projects.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white py-10 text-center text-sm text-neutral-400">
          Aucun projet lié à cette entreprise pour l'instant.
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
    </>
  )
}
