import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from '../../hooks/useCompanies'
import { buildStatutProspectUpdate } from '../../lib/companyUtils'
import {
  STATUT_PROSPECT_OPTIONS,
  STATUT_PROSPECT_TONES,
  TEMPERATURE_OPTIONS,
  TEMPERATURE_TONES,
  formatEnumLabel,
} from '../../lib/constants'
import InlineSelect from '../ui/InlineSelect'
import Modal from '../ui/Modal'
import CompanyForm from './CompanyForm'

const emptyFilters = { search: '', sector: '', statutProspect: '', temperature: '' }

export default function ProspectsList() {
  const [filters, setFilters] = useState(emptyFilters)
  const [creating, setCreating] = useState(false)

  const { data: companies, isLoading, isError, error } = useCompanies({
    search: filters.search,
    sector: filters.sector,
    statutProspect: filters.statutProspect,
    temperature: filters.temperature,
    statuses: ['prospect'],
  })

  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  async function handleDelete(company) {
    if (!window.confirm(`Supprimer « ${company.name} » et toutes ses données liées ?`)) {
      return
    }
    await deleteCompany.mutateAsync(company.id)
  }

  async function handleStatutProspectChange(company, newValue) {
    await updateCompany.mutateAsync({
      id: company.id,
      values: buildStatutProspectUpdate(newValue),
    })
  }

  async function handleTemperatureChange(company, newValue) {
    await updateCompany.mutateAsync({ id: company.id, values: { temperature: newValue } })
  }

  const hasActiveFilters =
    filters.search || filters.sector || filters.statutProspect || filters.temperature

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Prospects</h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="btn-primary"
        >
          + Nouveau prospect
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-chrome-dark bg-surface p-4">
        <input
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Rechercher par nom…"
          className="min-w-48 flex-1 input-chrome"
        />
        <select
          value={filters.statutProspect}
          onChange={(event) => updateFilter('statutProspect', event.target.value)}
          className="input-chrome"
        >
          <option value="">Toutes les étapes</option>
          {STATUT_PROSPECT_OPTIONS.map((statut) => (
            <option key={statut} value={statut}>
              {formatEnumLabel(statut)}
            </option>
          ))}
        </select>
        <select
          value={filters.temperature}
          onChange={(event) => updateFilter('temperature', event.target.value)}
          className="input-chrome"
        >
          <option value="">Toutes les températures</option>
          {TEMPERATURE_OPTIONS.map((temp) => (
            <option key={temp} value={temp}>
              {formatEnumLabel(temp)}
            </option>
          ))}
        </select>
        <input
          value={filters.sector}
          onChange={(event) => updateFilter('sector', event.target.value)}
          placeholder="Secteur…"
          className="w-40 input-chrome"
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="text-sm text-ink-secondary hover:text-ink"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <p className="text-xs text-ink-tertiary">
        Cliquez sur l'étape ou la température d'une ligne pour la modifier directement.
      </p>

      <div className="overflow-hidden rounded-lg border border-chrome-dark bg-surface">
        {isLoading && <p className="p-6 text-sm text-ink-secondary">Chargement…</p>}
        {isError && (
          <p className="p-6 text-sm font-medium text-red-400">Erreur de chargement : {error.message}</p>
        )}
        {!isLoading && !isError && companies.length === 0 && (
          <p className="p-6 text-sm text-ink-secondary">Aucun prospect trouvé.</p>
        )}
        {!isLoading && !isError && companies.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chrome-dark text-xs uppercase text-ink-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Étape</th>
                <th className="px-4 py-3 font-medium">Température</th>
                <th className="px-4 py-3 font-medium">Secteur</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-chrome-dark">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-surface-hover">
                  <td className="px-4 py-3">
                    <Link
                      to={`/companies/${company.id}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <InlineSelect
                      value={company.statut_prospect}
                      options={STATUT_PROSPECT_OPTIONS}
                      toneMap={STATUT_PROSPECT_TONES}
                      onChange={(value) => handleStatutProspectChange(company, value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <InlineSelect
                      value={company.temperature}
                      options={TEMPERATURE_OPTIONS}
                      toneMap={TEMPERATURE_TONES}
                      onChange={(value) => handleTemperatureChange(company, value)}
                    />
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{company.sector || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(company)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {creating && (
        <Modal title="Nouveau prospect" onClose={() => setCreating(false)}>
          <CompanyForm
            defaultStatus="prospect"
            submitting={createCompany.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await createCompany.mutateAsync(values)
              setCreating(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
