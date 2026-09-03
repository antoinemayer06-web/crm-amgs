import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DocumentsSection from '../documents/DocumentsSection'
import {
  useCashCollectionsForProject,
  useCreateCashCollection,
  useDeleteCashCollection,
} from '../../hooks/useCashCollections'
import { useWorkLogsForSteps } from '../../hooks/useProjectWorkLogs'
import {
  useDeleteProject,
  useGenerateRecurringFacture,
  useProject,
  useProjectFactureDate,
  useUpdateProject,
  useUpdateProjectMontantFacture,
} from '../../hooks/useProjects'
import { useAiChat } from '../../lib/AiChatContext'
import {
  PROJECT_STATUT_LABELS,
  PROJECT_STATUT_OPTIONS,
  RECURRENCE_FREQUENCES,
  RECURRENCE_FREQUENCE_LABELS,
} from '../../lib/constants'
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
    <div className="rounded-md bg-surface-hover px-3 py-2">
      <p className="text-[10px] font-medium text-ink-tertiary">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}

export default function ProjectPanel({ projectId, allSteps, onClose, onDeleted }) {
  const { data: project, isLoading } = useProject(projectId)
  const { data: factureDate } = useProjectFactureDate(projectId)
  const updateProject = useUpdateProject()
  const updateMontantFacture = useUpdateProjectMontantFacture()
  const generateRecurringFacture = useGenerateRecurringFacture()
  const deleteProject = useDeleteProject()
  const { data: cashCollections } = useCashCollectionsForProject(projectId)
  const createCashCollection = useCreateCashCollection()
  const deleteCashCollection = useDeleteCashCollection()
  const { setEntityContext } = useAiChat()

  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [heuresPrevues, setHeuresPrevues] = useState('')
  const [montantFacture, setMontantFacture] = useState('')
  const [dateFacturation, setDateFacturation] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateLivraisonPrevue, setDateLivraisonPrevue] = useState('')
  const [dateFinReelle, setDateFinReelle] = useState('')
  const [addingCash, setAddingCash] = useState(false)
  const [cashAmount, setCashAmount] = useState('')
  const [cashDate, setCashDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [saveError, setSaveError] = useState(null)
  const [recurrence, setRecurrence] = useState({ frequence: '', intervalle: '1', fin: '' })
  const [recurrenceMessage, setRecurrenceMessage] = useState(null)

  const steps = getStepsForProject(allSteps, projectId)
  const stepIds = steps.map((s) => s.id)
  const { data: workLogs } = useWorkLogsForSteps(stepIds)
  const actualHoursByStep = getActualHoursByStep(workLogs)
  const { tempsPrevu, tempsRealise } = getProjectTimeSummary(steps, workLogs)

  useEffect(() => {
    if (project) {
      setNom(project.nom)
      setDescription(project.description ?? '')
      setHeuresPrevues(project.heures_prevues ?? '')
      setMontantFacture(project.montant_facture ?? '')
      setDateDebut(project.date_debut ?? '')
      setDateLivraisonPrevue(project.date_livraison_prevue ?? '')
      setDateFinReelle(project.date_fin_reelle ?? '')
    }
  }, [project])

  // Outil ponctuel (pas un champ persisté) : ne se réinitialise que si
  // le panneau change réellement de projet, pas à chaque refetch (sinon
  // le message de confirmation disparaîtrait aussitôt après génération).
  useEffect(() => {
    setRecurrence({ frequence: '', intervalle: '1', fin: '' })
    setRecurrenceMessage(null)
  }, [project?.id])

  useEffect(() => {
    if (!project) return
    setEntityContext({ type: 'project', id: project.id, label: project.nom })
    return () => setEntityContext(null)
  }, [project, setEntityContext])

  // Préremplit avec la date déjà enregistrée sur le document de
  // facturation lié, ou aujourd'hui si aucun n'existe encore.
  useEffect(() => {
    if (factureDate !== undefined) {
      setDateFacturation(factureDate || new Date().toISOString().slice(0, 10))
    }
  }, [factureDate])

  function saveField(field, value) {
    setSaveError(null)
    updateProject.mutate(
      { id: projectId, values: { [field]: value } },
      { onError: (err) => setSaveError(err.message) },
    )
  }

  // Montant et date de facturation sont commis ensemble (le document
  // sous-jacent porte les deux) — au blur de l'un ou l'autre, dès que
  // l'un des deux a changé par rapport à ce qui est enregistré.
  function commitFacturation() {
    const montant = montantFacture === '' ? null : Number(montantFacture)
    const montantChanged = montant !== (project.montant_facture ?? null)
    const dateChanged = dateFacturation !== (factureDate ?? '')
    if (!montantChanged && !dateChanged) return

    setSaveError(null)
    updateMontantFacture.mutate(
      {
        projectId,
        companyId: project.company_id,
        projectNom: project.nom,
        montant,
        dateFacturation,
      },
      { onError: (err) => setSaveError(err.message) },
    )
  }

  function updateRecurrence(field, value) {
    setRecurrence((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGenerateRecurringFacture() {
    setSaveError(null)
    setRecurrenceMessage(null)
    const montant = montantFacture === '' ? null : Number(montantFacture)
    if (montant == null || !dateFacturation || !recurrence.frequence || !recurrence.fin) return

    try {
      const count = await generateRecurringFacture.mutateAsync({
        projectId,
        companyId: project.company_id,
        projectNom: project.nom,
        montant,
        dateDebut: dateFacturation,
        frequence: recurrence.frequence,
        intervalle: Number(recurrence.intervalle) || 1,
        dateFin: recurrence.fin,
      })
      setRecurrenceMessage(`${count} facture${count > 1 ? 's' : ''} générée${count > 1 ? 's' : ''}.`)
    } catch (err) {
      setSaveError(err.message)
    }
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

  async function handleDeleteCashCollection(collection) {
    if (!window.confirm('Supprimer cet encaissement ?')) return
    await deleteCashCollection.mutateAsync({
      id: collection.id,
      projectId,
      montant: collection.montant,
      currentMontantEncaisse: project.montant_encaisse,
    })
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : project?.nom} onClose={onClose}>
      {isLoading || !project ? (
        <p className="text-sm text-ink-secondary">Chargement…</p>
      ) : (
        <div className="space-y-6">
          {saveError && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
              {saveError}
            </p>
          )}

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
            <label className="block text-xs font-medium text-ink-secondary">Nom</label>
            <input
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              onBlur={() => nom.trim() && nom !== project.nom && saveField('nom', nom.trim())}
              className="w-full rounded-md border border-chrome-dark px-3 py-2 text-sm font-medium focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
            />
          </div>

          {project.company && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Client</label>
              <Link
                to={`/companies/${project.company.id}`}
                className="flex items-center gap-2 rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink-secondary hover:bg-surface-hover"
              >
                <Avatar name={project.company.name} />
                {project.company.name}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Statut</label>
              <select
                value={project.statut}
                onChange={(event) => saveField('statut', event.target.value)}
                className="w-full input-chrome"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Date de début
              </label>
              <input
                type="date"
                value={dateDebut}
                onChange={(event) => setDateDebut(event.target.value)}
                onBlur={() => {
                  const value = dateDebut || null
                  if (value !== (project.date_debut ?? null)) saveField('date_debut', value)
                }}
                className="w-full input-chrome"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Échéance
              </label>
              <input
                type="date"
                value={dateLivraisonPrevue}
                onChange={(event) => setDateLivraisonPrevue(event.target.value)}
                onBlur={() => {
                  const value = dateLivraisonPrevue || null
                  if (value !== (project.date_livraison_prevue ?? null)) {
                    saveField('date_livraison_prevue', value)
                  }
                }}
                className="w-full input-chrome"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Date de fin réelle
              </label>
              <input
                type="date"
                value={dateFinReelle}
                onChange={(event) => setDateFinReelle(event.target.value)}
                onBlur={() => {
                  const value = dateFinReelle || null
                  if (value !== (project.date_fin_reelle ?? null)) saveField('date_fin_reelle', value)
                }}
                className="w-full input-chrome"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Heures prévues (projet)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={heuresPrevues}
                onChange={(event) => setHeuresPrevues(event.target.value)}
                onBlur={() => {
                  const value = heuresPrevues === '' ? null : Number(heuresPrevues)
                  if (value !== (project.heures_prevues ?? null)) saveField('heures_prevues', value)
                }}
                className="w-full input-chrome"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Montant facturé (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={montantFacture}
                onChange={(event) => setMontantFacture(event.target.value)}
                onBlur={commitFacturation}
                className="w-full input-chrome"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">
                Date de facturation
              </label>
              <input
                type="date"
                value={dateFacturation}
                onChange={(event) => setDateFacturation(event.target.value)}
                onBlur={commitFacturation}
                className="w-full input-chrome"
              />
              <p className="text-[11px] text-ink-tertiary">
                C'est cette date qui détermine le mois du CA facturé.
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-chrome-dark p-3">
            <p className="text-xs font-medium text-ink-secondary">Facture récurrente (optionnel)</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label htmlFor="recurrence_intervalle" className="block text-xs text-ink-tertiary">
                  Tous les
                </label>
                <input
                  id="recurrence_intervalle"
                  type="number"
                  min="1"
                  value={recurrence.intervalle}
                  onChange={(event) => updateRecurrence('intervalle', event.target.value)}
                  disabled={!recurrence.frequence}
                  className="w-full input-chrome disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="recurrence_frequence" className="block text-xs text-ink-tertiary">
                  Fréquence
                </label>
                <select
                  id="recurrence_frequence"
                  value={recurrence.frequence}
                  onChange={(event) => updateRecurrence('frequence', event.target.value)}
                  className="w-full input-chrome"
                >
                  <option value="">Pas de récurrence</option>
                  {RECURRENCE_FREQUENCES.map((frequence) => (
                    <option key={frequence} value={frequence}>
                      {RECURRENCE_FREQUENCE_LABELS[frequence]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="recurrence_fin" className="block text-xs text-ink-tertiary">
                  Jusqu'au
                </label>
                <input
                  id="recurrence_fin"
                  type="date"
                  value={recurrence.fin}
                  onChange={(event) => updateRecurrence('fin', event.target.value)}
                  disabled={!recurrence.frequence}
                  className="w-full input-chrome disabled:opacity-50"
                />
              </div>
            </div>
            <p className="text-[11px] text-ink-tertiary">
              Génère une facture (même montant) à partir du {dateFacturation || 'aujourd\'hui'}, à
              la fréquence choisie, jusqu'à la date de fin — chaque occurrence reste ensuite
              modifiable/supprimable indépendamment depuis « Documents » ci-dessous.
            </p>
            <button
              type="button"
              onClick={handleGenerateRecurringFacture}
              disabled={
                generateRecurringFacture.isPending ||
                !recurrence.frequence ||
                !recurrence.fin ||
                montantFacture === ''
              }
              className="btn-secondary text-xs"
            >
              {generateRecurringFacture.isPending ? 'Génération…' : 'Générer les factures récurrentes'}
            </button>
            {recurrenceMessage && <p className="text-xs text-ink-secondary">{recurrenceMessage}</p>}
          </div>

          <div className="space-y-2 rounded-md border border-chrome-dark p-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-ink-secondary">
                Cash encaissé — {formatMontant(project.montant_encaisse)}
              </label>
              <button
                type="button"
                onClick={() => setAddingCash((prev) => !prev)}
                className="rounded-md border border-chrome-dark px-2 py-1 text-xs font-medium text-ink-secondary hover:bg-surface-hover"
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
                  className="col-span-1 rounded-md border border-chrome-dark px-2 py-1.5 text-sm focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
                />
                <input
                  type="date"
                  value={cashDate}
                  onChange={(event) => setCashDate(event.target.value)}
                  className="col-span-1 rounded-md border border-chrome-dark px-2 py-1.5 text-sm focus:border-chrome-mid focus:outline-none focus:ring-1 focus:ring-chrome-mid"
                />
                <button
                  type="submit"
                  disabled={createCashCollection.isPending}
                  className="btn-primary col-span-1 px-2 py-1.5 text-xs"
                >
                  Ajouter
                </button>
              </form>
            )}

            {cashCollections?.length > 0 && (
              <ul className="space-y-1 pt-1">
                {cashCollections.map((collection) => (
                  <li key={collection.id} className="flex items-center justify-between gap-2 text-xs text-ink-secondary">
                    <span>{new Date(collection.date_encaissement).toLocaleDateString('fr-FR')}</span>
                    <span className="ml-auto font-medium tabular-nums text-ink-secondary">
                      {formatMontant(collection.montant)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCashCollection(collection)}
                      className="shrink-0 text-ink-tertiary hover:text-red-400"
                      aria-label="Supprimer cet encaissement"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-secondary">
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
              className="w-full input-chrome"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-secondary">
              Étapes
            </label>
            <ProjectStepsChecklist
              projectId={projectId}
              steps={steps}
              actualHoursByStep={actualHoursByStep}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-secondary">
              Travail effectué
            </label>
            <ProjectWorkLog steps={steps} />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-secondary">
              Documents
            </label>
            <DocumentsSection companyId={project.company_id} projectId={projectId} />
          </div>

          <div className="flex items-center justify-between border-t border-chrome-dark pt-4">
            <button
              type="button"
              onClick={handleArchiveToggle}
              className="text-sm text-ink-secondary hover:text-ink"
            >
              {project.archived ? 'Désarchiver ce projet' : 'Archiver ce projet'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Supprimer ce projet
            </button>
          </div>
        </div>
      )}
    </SidePanel>
  )
}
