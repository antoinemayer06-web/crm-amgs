import { CAMPAIGN_STATUS_TONES, formatEnumLabel } from '../../lib/constants'
import Badge from '../ui/Badge'

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

export default function CampaignsListSection({ campaigns, onCampaignClick, onCreate }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreate}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Nouvelle campagne
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-chrome-dark bg-surface py-16 text-center">
          <p className="text-sm text-ink-tertiary">Aucune campagne pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => onCampaignClick(campaign)}
              className="flex flex-col gap-2 rounded-xl border border-chrome-dark bg-surface p-4 text-left shadow-sm transition-shadow duration-150 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-ink">{campaign.nom}</p>
                {campaign.statut && (
                  <Badge tone={CAMPAIGN_STATUS_TONES[campaign.statut]}>
                    {formatEnumLabel(campaign.statut)}
                  </Badge>
                )}
              </div>
              {campaign.objectif && (
                <p className="line-clamp-2 text-sm text-ink-secondary">{campaign.objectif}</p>
              )}
              <div className="mt-1 flex items-center justify-between text-xs text-ink-secondary">
                <span>
                  {formatDate(campaign.date_debut)} → {formatDate(campaign.date_fin)}
                </span>
                <span className="font-medium text-ink-secondary">{formatMontant(campaign.budget)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
