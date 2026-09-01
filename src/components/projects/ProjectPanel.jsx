import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDeleteProject, useProject, useUpdateProject } from '../../hooks/useProjects'
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_OPTIONS } from '../../lib/constants'
import { getStepsForProject } from '../../lib/projectUtils'
import Avatar from '../ui/Avatar'
import SidePanel from '../ui/SidePanel'
import ProjectStepsChecklist from './ProjectStepsChecklist'

export default function ProjectPanel({ projectId, allSteps, onClose, onDeleted }) {
  const { data: project, isLoading } = useProject(projectId)
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (project) {
      setNom(project.nom)
      setDescription(project.description ?? '')
    }
  }, [project])

  function saveField(field, value) {
    updateProject.mutate({ id: projectId, values: { [field]: value } })
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer le projet « ${project.nom} » ?`)) return
    await deleteProject.mutateAsync(projectId)
    onDeleted?.()
    onClose()
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : project?.nom} onClose={onClose}>
      {isLoading || !project ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : (
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase text-neutral-500">Nom</label>
            <input
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              onBlur={() => nom.trim() && nom !== project.nom && saveField('nom', nom.trim())}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>

          {project.company && (
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">Client</label>
              <Link
                to={`/companies/${project.company.id}`}
                className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <Avatar name={project.company.name} />
                {project.company.name}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">Statut</label>
              <select
                value={project.statut}
                onChange={(event) => saveField('statut', event.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              >
                {PROJECT_STATUT_OPTIONS.map((statut) => (
                  <option key={statut} value={statut}>
                    {PROJECT_STATUT_LABELS[statut]}
                  </option>
                ))}
              </select>
            </div>
            <div />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">
                Date de début
              </label>
              <input
                type="date"
                value={project.date_debut ?? ''}
                onChange={(event) => saveField('date_debut', event.target.value || null)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">
                Échéance
              </label>
              <input
                type="date"
                value={project.date_livraison_prevue ?? ''}
                onChange={(event) =>
                  saveField('date_livraison_prevue', event.target.value || null)
                }
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase text-neutral-500">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onBlur={() =>
                description !== (project.description ?? '') &&
                saveField('description', description.trim() || null)
              }
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase text-neutral-500">
              Étapes
            </label>
            <ProjectStepsChecklist
              projectId={projectId}
              steps={getStepsForProject(allSteps, projectId)}
            />
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Supprimer ce projet
            </button>
          </div>
        </div>
      )}
    </SidePanel>
  )
}
