import { useCompanies } from '../../hooks/useCompanies'
import { PROJECT_STATUT_LABELS, PROJECT_STATUT_OPTIONS } from '../../lib/constants'

export default function ProjectFilters({ filters, onChange }) {
  const { data: clients } = useCompanies({ statuses: ['client'] })

  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  const hasActiveFilters = filters.statut || filters.companyId || filters.lateOnly

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
      <select
        value={filters.statut}
        onChange={(event) => update('statut', event.target.value)}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      >
        <option value="">Tous les statuts</option>
        {PROJECT_STATUT_OPTIONS.map((statut) => (
          <option key={statut} value={statut}>
            {PROJECT_STATUT_LABELS[statut]}
          </option>
        ))}
      </select>

      <select
        value={filters.companyId}
        onChange={(event) => update('companyId', event.target.value)}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      >
        <option value="">Tous les clients</option>
        {clients?.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          checked={filters.lateOnly}
          onChange={(event) => update('lateOnly', event.target.checked)}
          className="rounded border-neutral-300"
        />
        En retard uniquement
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ statut: '', companyId: '', lateOnly: false })}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}
