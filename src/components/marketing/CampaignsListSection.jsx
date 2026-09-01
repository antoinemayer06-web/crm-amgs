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
        <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">Aucune campagne pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => onCampaignClick(campaign)}
              className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-shadow duration-150 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-neutral-900">{campaign.nom}</p>
                {campaign.statut && (
                  <Badge tone={CAMPAIGN_STATUS_TONES[campaign.statut]}>
                    {formatEnumLabel(campaign.statut)}
                  </Badge>
                )}
              </div>
              {campaign.objectif && (
                <p className="line-clamp-2 text-sm text-neutral-500">{campaign.objectif}</p>
              )}
              <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  {formatDate(campaign.date_debut)} → {formatDate(campaign.date_fin)}
                </span>
                <span className="font-medium text-neutral-700">{formatMontant(campaign.budget)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
