import { useState } from 'react'
import {
  useCreateProjectWorkLog,
  useDeleteProjectWorkLog,
  useProjectWorkLogs,
} from '../../hooks/useProjectWorkLogs'

const today = () => new Date().toISOString().slice(0, 10)
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

export default function ProjectWorkLog({ projectId }) {
  const [date, setDate] = useState(today())
  const [description, setDescription] = useState('')
  const [duree, setDuree] = useState('')
  const { data: logs, isLoading, isError, error } = useProjectWorkLogs(projectId)
  const createLog = useCreateProjectWorkLog()
  const deleteLog = useDeleteProjectWorkLog()

  async function handleAdd(event) {
    event.preventDefault()
    if (!description.trim()) return
    await createLog.mutateAsync({
      project_id: projectId,
      date,
      description: description.trim(),
      duree_heures: duree === '' ? null : Number(duree),
    })
    setDescription('')
    setDuree('')
  }

  async function handleDelete(log) {
    if (!window.confirm('Supprimer cette entrée ?')) return
    await deleteLog.mutateAsync({ id: log.id, projectId })
  }

  return (
    <div className="space-y-3">
      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}
      {!isLoading && !isError && logs.length === 0 && (
        <p className="text-sm text-neutral-400">Aucune entrée pour l'instant.</p>
      )}

      <ul className="space-y-2">
        {logs?.map((log) => (
          <li key={log.id} className="group rounded-md border border-neutral-200 p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm text-neutral-800">{log.description}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {formatDate(log.date)}
                  {log.duree_heures != null && ` · ${log.duree_heures} h`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(log)}
                className="shrink-0 text-neutral-300 opacity-0 hover:text-red-500 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="space-y-2 rounded-md border border-neutral-200 p-2.5">
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Travail effectué…"
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
          <input
            type="number"
            step="0.5"
            min="0"
            value={duree}
            onChange={(event) => setDuree(event.target.value)}
            placeholder="Heures"
            className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
          <button
            type="submit"
            disabled={createLog.isPending}
            className="ml-auto rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}
