import { MARKETING_ACTION_STATUSES, MARKETING_ACTION_TYPES, formatEnumLabel } from '../../lib/constants'

export default function MarketingFilters({ filters, onChange, campaigns }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.type}
        onChange={(event) => update('type', event.target.value)}
        className="input-chrome"
      >
        <option value="">Tous les types</option>
        {MARKETING_ACTION_TYPES.map((type) => (
          <option key={type} value={type}>
            {formatEnumLabel(type)}
          </option>
        ))}
      </select>

      <select
        value={filters.statut}
        onChange={(event) => update('statut', event.target.value)}
        className="input-chrome"
      >
        <option value="">Tous les statuts</option>
        {MARKETING_ACTION_STATUSES.map((statut) => (
          <option key={statut} value={statut}>
            {formatEnumLabel(statut)}
          </option>
        ))}
      </select>

      <select
        value={filters.campaignId}
        onChange={(event) => update('campaignId', event.target.value)}
        className="input-chrome"
      >
        <option value="">Toutes les campagnes</option>
        {campaigns?.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.nom}
          </option>
        ))}
      </select>
    </div>
  )
}
