import { useMemo, useState } from 'react'

const ACTION_TYPE_LABELS = {
  creer_entreprise: 'Créer une entreprise',
  mettre_a_jour_statut_prospect: 'Changer le statut prospect',
  ajouter_note: 'Ajouter une note',
  creer_projet: 'Créer un projet',
  mettre_a_jour_statut_projet: 'Changer le statut du projet',
  creer_tache_projet: 'Ajouter une étape',
  planifier_action_marketing: 'Planifier une action marketing',
  creer_campagne: 'Créer une campagne',
  creer_tache: 'Créer une tâche',
  creer_fiche_connaissance: 'Créer une fiche de connaissance',
}

export default function ActionCard({ actions, onResolve, submitting }) {
  const [removed, setRemoved] = useState(() => new Set())

  const groups = useMemo(() => {
    const map = new Map()
    for (const action of actions) {
      if (!map.has(action.action_type)) map.set(action.action_type, [])
      map.get(action.action_type).push(action)
    }
    return [...map.entries()]
  }, [actions])

  function toggleRemove(id) {
    setRemoved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const keptCount = actions.length - removed.size

  function handleValidate() {
    onResolve(actions.map((a) => ({ tool_use_id: a.tool_use_id, approved: !removed.has(a.tool_use_id) })))
  }

  function handleReject() {
    onResolve(actions.map((a) => ({ tool_use_id: a.tool_use_id, approved: false })))
  }

  return (
    <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      {groups.map(([type, items]) => (
        <div key={type} className="space-y-1.5">
          <p className="text-xs font-semibold text-amber-700">
            {ACTION_TYPE_LABELS[type] ?? type}
            {items.length > 1 ? ` (${items.length})` : ''}
          </p>
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.tool_use_id}
                className={`flex items-center justify-between gap-2 rounded-md bg-surface px-2.5 py-1.5 text-sm transition-opacity duration-150 ${
                  removed.has(item.tool_use_id) ? 'opacity-40 line-through' : ''
                }`}
              >
                <span className="text-ink-secondary">{item.description}</span>
                {actions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => toggleRemove(item.tool_use_id)}
                    className="shrink-0 text-xs text-ink-tertiary hover:text-red-600"
                  >
                    {removed.has(item.tool_use_id) ? 'Reprendre' : '✕ Retirer'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleReject}
          disabled={submitting}
          className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          ❌ Rejeter
        </button>
        <button
          type="button"
          onClick={handleValidate}
          disabled={submitting || keptCount === 0}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          ✅ Valider{actions.length > 1 ? ` (${keptCount})` : ''}
        </button>
      </div>
    </div>
  )
}
