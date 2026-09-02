import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DocumentsSection from '../documents/DocumentsSection'
import { useCashCollectionsForProject, useCreateCashCollection } from '../../hooks/useCashCollections'
import { useWorkLogsForSteps } from '../../hooks/useProjectWorkLogs'
import { useDeleteProject, useProject, useUpdateProject } from '../../hooks/useProjects'
import { useAiChat } from '../../lib/AiChatContext'
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_OPTIONS } from '../../lib/constants'
import {
  getActualHoursByStep,
  getProjectTimeSummary,
  getStepsForProject,
} from '../../lib/projectUtils'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import SidePanel from '../ui/SidePanel'
import ProjectStepsChecklist from './ProjectStepsChecklist'
import ProjectWorkLog from './ProjectWorkLog'

const formatHours = (value) => (value == null ? '—' : `${value} h`)
const formatMontant = (value) => (value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`)

function StatTile({ label, value }) {
  return (
    <div className="rounded-md bg-neutral-50 px-3 py-2">
      <p className="text-[10px] font-medium uppercase text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  )
}

export default function ProjectPanel({ projectId, allSteps, onClose, onDeleted }) {
  const { data: project, isLoading } = useProject(projectId)
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const { data: cashCollections } = useCashCollectionsForProject(projectId)
  const createCashCollection = useCreateCashCollection()
  const { setEntityContext } = useAiChat()

  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [addingCash, setAddingCash] = useState(false)
  const [cashAmount, setCashAmount] = useState('')
  const [cashDate, setCashDate] = useState(() => new Date().toISOString().slice(0, 10))

  const steps = getStepsForProject(allSteps, projectId)
  const stepIds = steps.map((s) => s.id)
  const { data: workLogs } = useWorkLogsForSteps(stepIds)
  const actualHoursByStep = getActualHoursByStep(workLogs)
  const { tempsPrevu, tempsRealise } = getProjectTimeSummary(steps, workLogs)

  useEffect(() => {
    if (project) {
      setNom(project.nom)
      setDescription(project.description ?? '')
    }
  }, [project])

  useEffect(() => {
    if (!project) return
    setEntityContext({ type: 'project', id: project.id, label: project.nom })
    return () => setEntityContext(null)
  }, [project, setEntityContext])

  function saveField(field, value) {
    updateProject.mutate({ id: projectId, values: { [field]: value } })
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer le projet « ${project.nom} » ?`)) return
    await deleteProject.mutateAsync(projectId)
    onDeleted?.()
    onClose()
  }

  function handleArchiveToggle() {
    saveField('archived', !project.archived)
  }

  async function handleAddCashCollection(event) {
    event.preventDefault()
    const montant = Number(cashAmount)
    if (!montant || montant <= 0) return
    await createCashCollection.mutateAsync({
      projectId,
      montant,
      dateEncaissement: cashDate,
      currentMontantEncaisse: project.montant_encaisse,
    })
    setCashAmount('')
    setAddingCash(false)
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : project?.nom} onClose={onClose}>
      {isLoading || !project ? (
        <p className="text-sm text-neutral-500">Chargement…</p>
      ) : (
        <div className="space-y-6">
          {project.archived && (
            <Badge tone="neutral">Archivé</Badge>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile label="Temps prévu" value={formatHours(tempsPrevu)} />
            <StatTile label="Temps réalisé" value={formatHours(tempsRealise || null)} />
            <StatTile label="Facturé" value={formatMontant(project.montant_facture)} />
            <StatTile label="Reçu" value={formatMontant(project.montant_encaisse)} />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">
                Date de fin réelle
              </label>
              <input
                type="date"
                value={project.date_fin_reelle ?? ''}
                onChange={(event) => saveField('date_fin_reelle', event.target.value || null)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium uppercase text-neutral-500">
                Heures prévues (projet)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={project.heures_prevues ?? ''}
                onChange={(event) =>
                  saveField('heures_prevues', event.target.value === '' ? null : Number(event.target.value))
                }
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase text-neutral-500">
              Montant facturé (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={project.montant_facture ?? ''}
              onChange={(event) =>
                saveField('montant_facture', event.target.value === '' ? null : Number(event.target.value))
              }
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
          </div>

          <div className="space-y-2 rounded-md border border-neutral-200 p-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium uppercase text-neutral-500">
                Cash encaissé — {formatMontant(project.montant_encaisse)}
              </label>
              <button
                type="button"
                onClick={() => setAddingCash((prev) => !prev)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
              >
                + Encaissement
              </button>
            </div>

            {addingCash && (
              <form onSubmit={handleAddCashCollection} className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Montant (€)"
                  value={cashAmount}
                  onChange={(event) => setCashAmount(event.target.value)}
                  className="col-span-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                />
                <input
                  type="date"
                  value={cashDate}
                  onChange={(event) => setCashDate(event.target.value)}
                  className="col-span-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                />
                <button
                  type="submit"
                  disabled={createCashCollection.isPending}
                  className="col-span-1 rounded-md bg-neutral-900 px-2 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  Ajouter
                </button>
              </form>
            )}

            {cashCollections?.length > 0 && (
              <ul className="space-y-1 pt-1">
                {cashCollections.map((collection) => (
                  <li key={collection.id} className="flex justify-between text-xs text-neutral-500">
                    <span>{new Date(collection.date_encaissement).toLocaleDateString('fr-FR')}</span>
                    <span className="font-medium text-neutral-700">{formatMontant(collection.montant)}</span>
                  </li>
                ))}
              </ul>
            )}
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
              steps={steps}
              actualHoursByStep={actualHoursByStep}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase text-neutral-500">
              Travail effectué
            </label>
            <ProjectWorkLog steps={steps} />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase text-neutral-500">
              Documents
            </label>
            <DocumentsSection companyId={project.company_id} projectId={projectId} />
          </div>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={handleArchiveToggle}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              {project.archived ? 'Désarchiver ce projet' : 'Archiver ce projet'}
            </button>
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
