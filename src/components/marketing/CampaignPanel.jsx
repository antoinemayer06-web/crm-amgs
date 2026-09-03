import { useState } from 'react'
import { useCampaign, useDeleteCampaign, useUpdateCampaign } from '../../hooks/useCampaigns'
import { useCompanies } from '../../hooks/useCompanies'
import { useCreateMarketingAction, useMarketingActions } from '../../hooks/useMarketingActions'
import {
  CAMPAIGN_STATUS_TONES,
  MARKETING_ACTION_STATUS_TONES,
  MARKETING_ACTION_TYPE_TONES,
  formatEnumLabel,
} from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import SidePanel from '../ui/SidePanel'
import ActionForm from './ActionForm'
import CampaignForm from './CampaignForm'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

export default function CampaignPanel({ campaignId, onClose, onDeleted, onActionClick }) {
  const { data: campaign, isLoading } = useCampaign(campaignId)
  const { data: actions } = useMarketingActions({ campaignId })
  const { data: companies } = useCompanies({ statuses: ['prospect'] })
  const updateCampaign = useUpdateCampaign()
  const deleteCampaign = useDeleteCampaign()
  const createAction = useCreateMarketingAction()
  const [editing, setEditing] = useState(false)
  const [creatingAction, setCreatingAction] = useState(false)

  async function handleDelete() {
    if (!window.confirm(`Supprimer la campagne « ${campaign.nom} » ?`)) return
    await deleteCampaign.mutateAsync(campaignId)
    onDeleted?.()
    onClose()
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : campaign?.nom} onClose={onClose}>
      {isLoading || !campaign ? (
        <p className="text-sm text-ink-secondary">Chargement…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {campaign.statut && (
              <Badge tone={CAMPAIGN_STATUS_TONES[campaign.statut]}>
                {formatEnumLabel(campaign.statut)}
              </Badge>
            )}
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

          {campaign.objectif && (
            <div>
              <p className="mb-1 text-sm font-medium text-ink-secondary">Objectif</p>
              <p className="text-selectable whitespace-pre-wrap text-sm text-ink-secondary">{campaign.objectif}</p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-tertiary">Début</dt>
              <dd className="mt-0.5 font-medium text-ink">{formatDate(campaign.date_debut)}</dd>
            </div>
            <div>
              <dt className="text-ink-tertiary">Fin</dt>
              <dd className="mt-0.5 font-medium text-ink">{formatDate(campaign.date_fin)}</dd>
            </div>
            <div>
              <dt className="text-ink-tertiary">Budget</dt>
              <dd className="mt-0.5 font-medium text-ink">{formatMontant(campaign.budget)}</dd>
            </div>
          </dl>

          <div className="space-y-2 border-t border-chrome-dark pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink-secondary">
                Actions liées {actions ? `(${actions.length})` : ''}
              </p>
              <button
                type="button"
                onClick={() => setCreatingAction(true)}
                className="rounded-md border border-chrome-dark px-2.5 py-1 text-xs font-medium text-ink-secondary hover:bg-surface-hover"
              >
                + Nouvelle action
              </button>
            </div>

            {!actions || actions.length === 0 ? (
              <p className="rounded-md bg-surface-hover px-3 py-2 text-sm text-ink-tertiary">
                Aucune action liée à cette campagne.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-chrome-dark">
                {actions.map((action, index) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => onActionClick(action.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-150 hover:bg-surface-hover ${
                      index > 0 ? 'border-t border-chrome-dark' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{action.titre}</p>
                      <p className="text-xs text-ink-secondary">{formatDate(action.date_prevue)}</p>
                    </div>
                    <Badge tone={MARKETING_ACTION_TYPE_TONES[action.type]}>
                      {formatEnumLabel(action.type)}
                    </Badge>
                    <Badge tone={MARKETING_ACTION_STATUS_TONES[action.statut]}>
                      {formatEnumLabel(action.statut)}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {editing && (
            <Modal title={`Modifier « ${campaign.nom} »`} onClose={() => setEditing(false)}>
              <CampaignForm
                initialValues={campaign}
                submitting={updateCampaign.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={async (values) => {
                  await updateCampaign.mutateAsync({ id: campaignId, values })
                  setEditing(false)
                }}
              />
            </Modal>
          )}

          {creatingAction && (
            <Modal title="Nouvelle action" onClose={() => setCreatingAction(false)}>
              <ActionForm
                defaultCampaignId={campaignId}
                campaigns={[campaign]}
                companies={companies}
                submitting={createAction.isPending}
                onCancel={() => setCreatingAction(false)}
                onSubmit={async (values) => {
                  await createAction.mutateAsync(values)
                  setCreatingAction(false)
                }}
              />
            </Modal>
          )}
        </div>
      )}
    </SidePanel>
  )
}
