import { COMPANY_SOURCES, TEMPERATURE_OPTIONS, formatEnumLabel } from '../../lib/constants'

export default function PipelineFilters({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  const hasActiveFilters = filters.source || filters.temperature || filters.lateOnly

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-chrome-dark bg-surface p-3">
      <select
        value={filters.source}
        onChange={(event) => update('source', event.target.value)}
        className="input-chrome"
      >
        <option value="">Toutes les sources</option>
        {COMPANY_SOURCES.map((source) => (
          <option key={source} value={source}>
            {formatEnumLabel(source)}
          </option>
        ))}
      </select>

      <select
        value={filters.temperature}
        onChange={(event) => update('temperature', event.target.value)}
        className="input-chrome"
      >
        <option value="">Toutes les températures</option>
        {TEMPERATURE_OPTIONS.map((temp) => (
          <option key={temp} value={temp}>
            {formatEnumLabel(temp)}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        <input
          type="checkbox"
          checked={filters.lateOnly}
          onChange={(event) => update('lateOnly', event.target.checked)}
          className="rounded border-chrome-dark"
        />
        Actions en retard uniquement
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ source: '', temperature: '', lateOnly: false })}
          className="text-sm text-ink-secondary hover:text-ink"
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}
