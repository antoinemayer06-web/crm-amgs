import { useEffect, useState } from 'react'
import {
  useDeleteMarketingAction,
  useMarketingAction,
  useUpdateMarketingAction,
} from '../../hooks/useMarketingActions'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useCompanies } from '../../hooks/useCompanies'
import {
  MARKETING_ACTION_STATUSES,
  MARKETING_ACTION_STATUS_TONES,
  MARKETING_ACTION_TYPE_TONES,
  RECURRENCE_FREQUENCE_LABELS,
  formatEnumLabel,
} from '../../lib/constants'
import Badge from '../ui/Badge'
import InlineSelect from '../ui/InlineSelect'
import Modal from '../ui/Modal'
import SidePanel from '../ui/SidePanel'
import ActionForm from './ActionForm'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')

export default function ActionPanel({ actionId, onClose, onDeleted }) {
  const { data: action, isLoading } = useMarketingAction(actionId)
  const { data: campaigns } = useCampaigns()
  const { data: companies } = useCompanies({ statuses: ['prospect'] })
  const updateAction = useUpdateMarketingAction()
  const deleteAction = useDeleteMarketingAction()
  const [editing, setEditing] = useState(false)
  const [resultats, setResultats] = useState('')

  useEffect(() => {
    setResultats(action?.resultats ?? '')
  }, [action?.resultats])

  async function handleStatutChange(newValue) {
    await updateAction.mutateAsync({ id: actionId, values: { statut: newValue } })
  }

  async function handleSaveResultats() {
    await updateAction.mutateAsync({ id: actionId, values: { resultats: resultats.trim() || null } })
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer l'action « ${action.titre} » ?`)) return
    await deleteAction.mutateAsync(actionId)
    onDeleted?.()
    onClose()
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : action?.titre} onClose={onClose}>
      {isLoading || !action ? (
        <p className="text-sm text-ink-secondary">Chargement…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={MARKETING_ACTION_TYPE_TONES[action.type]}>
              {formatEnumLabel(action.type)}
            </Badge>
            {action.recurrence_frequence && (
              <Badge tone="neutral">
                Récurrent — tous les {action.recurrence_intervalle}{' '}
                {RECURRENCE_FREQUENCE_LABELS[action.recurrence_frequence]}
              </Badge>
            )}
            <InlineSelect
              value={action.statut}
              options={MARKETING_ACTION_STATUSES}
              toneMap={MARKETING_ACTION_STATUS_TONES}
              onChange={handleStatutChange}
            />
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="ml-auto rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              Supprimer
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-tertiary">Date prévue</dt>
              <dd className="mt-0.5 font-medium text-ink">{formatDate(action.date_prevue)}</dd>
            </div>
            <div>
              <dt className="text-ink-tertiary">Campagne</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {action.campaign?.nom ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-tertiary">Prospect lié</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {action.company?.name ?? '—'}
              </dd>
            </div>
          </dl>

          {action.description && (
            <div>
              <p className="mb-1 text-sm font-medium text-ink-secondary">Description</p>
              <p className="text-selectable whitespace-pre-wrap text-sm text-ink-secondary">{action.description}</p>
            </div>
          )}

          <div className="space-y-2 border-t border-chrome-dark pt-4">
            <label htmlFor="resultats" className="block text-sm font-medium text-ink-secondary">
              Résultats
            </label>
            <textarea
              id="resultats"
              rows={4}
              value={resultats}
              onChange={(event) => setResultats(event.target.value)}
              placeholder="Notez les performances une fois l'action publiée…"
              className="w-full input-chrome"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveResultats}
                disabled={updateAction.isPending || resultats === (action.resultats ?? '')}
                className="btn-primary"
              >
                Enregistrer les résultats
              </button>
            </div>
          </div>

          {editing && (
            <Modal title={`Modifier « ${action.titre} »`} onClose={() => setEditing(false)}>
              <ActionForm
                initialValues={action}
                campaigns={campaigns}
                companies={companies}
                submitting={updateAction.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={async (values) => {
                  await updateAction.mutateAsync({ id: actionId, values })
                  setEditing(false)
                }}
              />
            </Modal>
          )}
        </div>
      )}
    </SidePanel>
  )
}
