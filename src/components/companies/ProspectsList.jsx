import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useCompanies,
  useConvertToClient,
  useCreateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from '../../hooks/useCompanies'
import {
  COMPANY_STATUS_TONES,
  STATUT_PROSPECT_OPTIONS,
  STATUT_PROSPECT_TONES,
} from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import CompanyForm from './CompanyForm'

const emptyFilters = { search: '', statusScope: '', sector: '', statutProspect: '', tag: '' }

export default function ProspectsList() {
  const [filters, setFilters] = useState(emptyFilters)
  const [modalMode, setModalMode] = useState(null) // null | 'create' | company object

  const statuses = filters.statusScope ? [filters.statusScope] : ['prospect', 'dormant']
  const { data: companies, isLoading, isError, error } = useCompanies({
    search: filters.search,
    sector: filters.sector,
    statutProspect: filters.statutProspect,
    tag: filters.tag,
    statuses,
  })

  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()
  const convertToClient = useConvertToClient()

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  async function handleDelete(company) {
    if (!window.confirm(`Supprimer « ${company.name} » et toutes ses données liées ?`)) {
      return
    }
    await deleteCompany.mutateAsync(company.id)
  }

  async function handleConvert(company) {
    if (!window.confirm(`Convertir « ${company.name} » en client ?`)) return
    await convertToClient.mutateAsync(company.id)
  }

  const hasActiveFilters =
    filters.search || filters.statusScope || filters.sector || filters.statutProspect || filters.tag

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Prospects</h2>
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Nouveau prospect
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
          value={filters.statusScope}
          onChange={(event) => updateFilter('statusScope', event.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="">Actifs + dormants</option>
          <option value="prospect">Actifs</option>
          <option value="dormant">Dormants (à relancer)</option>
        </select>
        <select
          value={filters.statutProspect}
          onChange={(event) => updateFilter('statutProspect', event.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="">Toutes les étapes</option>
          {STATUT_PROSPECT_OPTIONS.map((statut) => (
            <option key={statut} value={statut}>
              {statut}
            </option>
          ))}
        </select>
        <input
          value={filters.sector}
          onChange={(event) => updateFilter('sector', event.target.value)}
          placeholder="Secteur…"
          className="w-40 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <input
          value={filters.tag}
          onChange={(event) => updateFilter('tag', event.target.value)}
          placeholder="Tag…"
          className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
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
          <p className="p-6 text-sm text-neutral-500">Aucun prospect trouvé.</p>
        )}
        {!isLoading && !isError && companies.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Étape</th>
                <th className="px-4 py-3 font-medium">Secteur</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {companies.map((company) => (
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
                    <Badge tone={COMPANY_STATUS_TONES[company.status]}>{company.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {company.statut_prospect ? (
                      <Badge tone={STATUT_PROSPECT_TONES[company.statut_prospect]}>
                        {company.statut_prospect}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{company.sector || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {company.tags?.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      {company.statut_prospect === 'devis_signé' && (
                        <button
                          type="button"
                          onClick={() => handleConvert(company)}
                          className="font-medium text-green-600 hover:text-green-800"
                        >
                          Convertir en client
                        </button>
                      )}
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalMode === 'create' && (
        <Modal title="Nouveau prospect" onClose={() => setModalMode(null)}>
          <CompanyForm
            defaultStatus="prospect"
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
