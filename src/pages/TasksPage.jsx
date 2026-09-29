import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import TaskForm from '../components/tasks/TaskForm'
import TaskRow from '../components/tasks/TaskRow'
import { useCompanies } from '../hooks/useCompanies'
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../hooks/useTasks'
import { useMarketingActions } from '../hooks/useMarketingActions'
import { useAllProjectSteps, useProjects } from '../hooks/useProjects'
import {
  UNIFIED_STATUT_LABELS,
  UNIFIED_STATUT_TONES,
  isDatePassee,
  isDateUrgente,
  marketingStatutToUnified,
} from '../lib/constants'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')

function todayKey() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString().slice(0, 10)
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-chrome-dark bg-surface p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  )
}

function EmptyRow({ children }) {
  return <p className="px-4 py-6 text-center text-sm text-ink-tertiary">{children}</p>
}

export default function TasksPage() {
  const [companyFilter, setCompanyFilter] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const { data: companies } = useCompanies({})
  const { data: tasks, isLoading: loadingTasks, isError: errorTasks } = useTasks({
    companyId: companyFilter || undefined,
  })
  const { data: projects } = useProjects({ archived: false })
  const { data: allSteps } = useAllProjectSteps()
  const { data: marketingActions } = useMarketingActions({})

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const projectsById = useMemo(
    () => Object.fromEntries((projects ?? []).map((project) => [project.id, project])),
    [projects],
  )

  // Étapes de projet non terminées, groupées par projet — la modification
  // reste dans ProjectPanel (fiche projet), cette section n'est qu'un
  // aperçu avec lien vers la source.
  const stepsByProject = useMemo(() => {
    const map = new Map()
    for (const step of allSteps ?? []) {
      if (step.statut === 'fait') continue
      const project = projectsById[step.project_id]
      if (!project) continue
      if (!map.has(project.id)) map.set(project.id, { project, steps: [] })
      map.get(project.id).steps.push(step)
    }
    return [...map.values()]
  }, [allSteps, projectsById])

  // Actions marketing à venir : pas encore passées, et pas annulées (une
  // action annulée n'est plus "à faire").
  const upcomingActions = useMemo(() => {
    const today = todayKey()
    return (marketingActions ?? [])
      .filter((action) => action.date_prevue && action.date_prevue >= today && action.statut !== 'annulé')
      .sort((a, b) => (a.date_prevue < b.date_prevue ? -1 : 1))
  }, [marketingActions])

  // Prochaines actions prospects : le champ prochaine_action est un texte
  // libre sans statut structuré (voir l'audit) — on affiche donc juste la
  // date et le texte, sans pastille de statut inventée.
  const prospectsWithNextAction = useMemo(() => {
    return (companies ?? [])
      .filter((company) => company.date_prochaine_action)
      .sort((a, b) => (a.date_prochaine_action < b.date_prochaine_action ? -1 : 1))
  }, [companies])

  function handleToggleDone(task) {
    updateTask.mutate({ id: task.id, values: { statut: task.statut === 'fait' ? 'à_faire' : 'fait' } })
  }

  function handleDelete(task) {
    if (!window.confirm(`Supprimer la tâche « ${task.titre} » ?`)) return
    deleteTask.mutate(task.id)
  }

  async function handleSubmit(values) {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, values })
    } else {
      await createTask.mutateAsync(values)
    }
    setCreating(false)
    setEditingTask(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Tâches</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
            className="input-chrome w-auto text-sm"
          >
            <option value="">Toutes les entreprises</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setCreating(true)} className="btn-primary">
            Nouvelle tâche
          </button>
        </div>
      </div>

      <SectionCard title="Tâches">
        {loadingTasks && <p className="px-4 py-6 text-sm text-ink-secondary">Chargement…</p>}
        {errorTasks && <p className="px-4 py-6 text-sm font-medium text-red-400">Erreur de chargement.</p>}
        {!loadingTasks && !errorTasks && (tasks?.length ?? 0) === 0 && (
          <EmptyRow>Aucune tâche pour l'instant.</EmptyRow>
        )}
        {!loadingTasks && !errorTasks && (tasks?.length ?? 0) > 0 && (
          <div className="divide-y divide-chrome-dark">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleDone={handleToggleDone}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Étapes de projet en attente">
        {stepsByProject.length === 0 ? (
          <EmptyRow>Aucune étape de projet en attente.</EmptyRow>
        ) : (
          <div className="space-y-4">
            {stepsByProject.map(({ project, steps }) => (
              <div key={project.id}>
                <Link
                  to={`/projects?open=${project.id}`}
                  className="text-sm font-medium text-ink hover:underline"
                >
                  {project.nom}
                  {project.company?.name ? ` — ${project.company.name}` : ''}
                </Link>
                <ul className="mt-1.5 space-y-1">
                  {steps.map((step) => (
                    <li key={step.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-ink-secondary">{step.titre}</span>
                      <Badge tone={UNIFIED_STATUT_TONES[step.statut]}>
                        {UNIFIED_STATUT_LABELS[step.statut] ?? step.statut}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Actions marketing à venir">
        {upcomingActions.length === 0 ? (
          <EmptyRow>Aucune action marketing à venir.</EmptyRow>
        ) : (
          <ul className="divide-y divide-chrome-dark">
            {upcomingActions.map((action) => {
              const unified = marketingStatutToUnified(action.statut)
              return (
                <li key={action.id} className="flex items-center justify-between gap-3 py-2">
                  <Link to={`/marketing?open=${action.id}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:underline">
                    {action.titre}
                  </Link>
                  <span className="shrink-0 text-xs text-ink-tertiary">{formatDate(action.date_prevue)}</span>
                  <Badge tone={UNIFIED_STATUT_TONES[unified]}>{UNIFIED_STATUT_LABELS[unified] ?? unified}</Badge>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Prochaines actions prospects">
        {prospectsWithNextAction.length === 0 ? (
          <EmptyRow>Aucune prochaine action renseignée.</EmptyRow>
        ) : (
          <ul className="divide-y divide-chrome-dark">
            {prospectsWithNextAction.map((company) => {
              const urgent = isDateUrgente(company.date_prochaine_action)
              const passee = isDatePassee(company.date_prochaine_action)
              return (
                <li key={company.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <Link to={`/companies/${company.id}`} className="truncate text-sm text-ink hover:underline">
                      {company.name}
                    </Link>
                    <p className="truncate text-xs text-ink-secondary">{company.prochaine_action || '—'}</p>
                  </div>
                  <span className={`shrink-0 text-xs ${passee ? 'font-medium text-red-400' : urgent ? 'text-amber-400' : 'text-ink-tertiary'}`}>
                    {formatDate(company.date_prochaine_action)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>

      {(creating || editingTask) && (
        <Modal
          title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          onClose={() => {
            setCreating(false)
            setEditingTask(null)
          }}
        >
          <TaskForm
            initialValues={editingTask}
            companies={companies}
            submitting={createTask.isPending || updateTask.isPending}
            onCancel={() => {
              setCreating(false)
              setEditingTask(null)
            }}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </div>
  )
}
