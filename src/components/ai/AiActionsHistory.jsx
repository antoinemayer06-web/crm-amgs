import { Link } from 'react-router-dom'
import { useAiActionsLog } from '../../hooks/useAiActionsLog'

const STATUT_TONES = {
  proposée: 'bg-amber-100 text-amber-700',
  validée: 'bg-green-100 text-green-700',
  rejetée: 'bg-surface-hover text-ink-secondary',
}

function entityLink(row) {
  if (row.statut !== 'validée' || !row.result?.id) return null
  const { table, id } = row.result
  if (table === 'companies') return `/companies/${id}`
  if (table === 'projects') return `/projects?open=${id}`
  if (table === 'knowledge_base') return `/knowledge/${id}`
  if (table === 'marketing_actions' || table === 'campaigns') return '/marketing'
  if (table === 'tasks') return row.payload?.company_id ? `/companies/${row.payload.company_id}` : null
  return null
}

export default function AiActionsHistory() {
  const { data, isLoading } = useAiActionsLog()

  if (isLoading) return <p className="text-sm text-ink-secondary">Chargement…</p>
  if (!data || data.length === 0) {
    return <p className="text-sm text-ink-tertiary">Aucune action proposée pour l'instant.</p>
  }

  return (
    <ul className="space-y-2">
      {data.map((row) => {
        const link = entityLink(row)
        const content = (
          <div className="flex items-start justify-between gap-2 rounded-md border border-chrome-dark px-3 py-2 transition-colors duration-150 hover:bg-surface-hover">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink-secondary">{row.description}</p>
              <p className="text-xs text-ink-tertiary">{new Date(row.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                STATUT_TONES[row.statut] ?? STATUT_TONES.proposée
              }`}
            >
              {row.statut}
            </span>
          </div>
        )
        return <li key={row.id}>{link ? <Link to={link}>{content}</Link> : content}</li>
      })}
    </ul>
  )
}
