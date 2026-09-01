import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from '../../hooks/useCompanies'
import { useClientActivityMap } from '../../hooks/useProjects'
import {
  STATUT_LIVRAISON_OPTIONS,
  STATUT_LIVRAISON_TONES,
  TEMPERATURE_OPTIONS,
  TEMPERATURE_TONES,
  isEcheanceUrgente,
} from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import CompanyForm from './CompanyForm'

const emptyFilters = { search: '', sector: '', statutLivraison: '', temperature: '' }

export default function ClientsList() {
  const [filters, setFilters] = useState(emptyFilters)
  const [modalMode, setModalMode] = useState(null) // null | 'create' | company object

  const { data: companies, isLoading, isError, error } = useCompanies({
    search: filters.search,
    sector: filters.sector,
    statutLivraison: filters.statutLivraison,
    temperature: filters.temperature,
    statuses: ['client'],
  })

  const companyIds = companies?.map((company) => company.id) ?? []
  const { data: activityMap } = useClientActivityMap(companyIds)

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

  const hasActiveFilters =
    filters.search || filters.sector || filters.statutLivraison || filters.temperature

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Clients</h2>
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nouveau client
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <input
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Rechercher par nom…"
          className="min-w-48 flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <select
          value={filters.statutLivraison}
          onChange={(event) => updateFilter('statutLivraison', event.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="">Tous les statuts de livraison</option>
          {STATUT_LIVRAISON_OPTIONS.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </select>
        <select
          value={filters.temperature}
          onChange={(event) => updateFilter('temperature', event.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="">Toutes les températures</option>
          {TEMPERATURE_OPTIONS.map((temp) => (
            <option key={temp} value={temp}>
              {temp}
            </option>
          ))}
        </select>
        <input
          value={filters.sector}
          onChange={(event) => updateFilter('sector', event.target.value)}
          placeholder="Secteur…"
          className="w-40 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {isLoading && <p className="p-6 text-sm text-neutral-500">Chargement…</p>}
        {isError && (
          <p className="p-6 text-sm text-red-600">Erreur de chargement : {error.message}</p>
        )}
        {!isLoading && !isError && companies.length === 0 && (
          <p className="p-6 text-sm text-neutral-500">Aucun client trouvé.</p>
        )}
        {!isLoading && !isError && companies.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Livraison</th>
                <th className="px-4 py-3 font-medium">Activité</th>
                <th className="px-4 py-3 font-medium">Température</th>
                <th className="px-4 py-3 font-medium">Secteur</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {companies.map((company) => {
                const urgent =
                  company.statut_livraison === 'en_cours_livraison' &&
                  isEcheanceUrgente(company.date_echeance)
                const actif = activityMap?.[company.id] ?? false

                return (
                  <tr key={company.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/companies/${company.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {company.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {company.statut_livraison ? (
                          <Badge tone={STATUT_LIVRAISON_TONES[company.statut_livraison]}>
                            {company.statut_livraison}
                          </Badge>
                        ) : (
                          '—'
                        )}
                        {urgent && (
                          <span
                            title="Échéance dépassée ou proche"
                            className="h-2 w-2 shrink-0 rounded-full bg-red-500"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={actif ? 'green' : 'neutral'}>
                        {actif ? 'actif' : 'inactif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {company.temperature ? (
                        <Badge tone={TEMPERATURE_TONES[company.temperature]}>
                          {company.temperature}
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{company.sector || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setModalMode(company)}
                          className="text-neutral-500 hover:text-neutral-900"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(company)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalMode === 'create' && (
        <Modal title="Nouveau client" onClose={() => setModalMode(null)}>
          <CompanyForm
            defaultStatus="client"
            submitting={createCompany.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await createCompany.mutateAsync(values)
              setModalMode(null)
            }}
          />
        </Modal>
      )}

      {modalMode && modalMode !== 'create' && (
        <Modal title={`Modifier « ${modalMode.name} »`} onClose={() => setModalMode(null)}>
          <CompanyForm
            initialValues={modalMode}
            submitting={updateCompany.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await updateCompany.mutateAsync({ id: modalMode.id, values })
              setModalMode(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
