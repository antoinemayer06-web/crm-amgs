import { useMemo, useState } from 'react'
import PipelineFilters from '../components/pipeline/PipelineFilters'
import PipelineKanban from '../components/pipeline/PipelineKanban'
import PipelineListView from '../components/pipeline/PipelineListView'
import ProspectPanel from '../components/pipeline/ProspectPanel'
import { useCompanies, useUpdateCompany } from '../hooks/useCompanies'
import { buildStatutProspectUpdate } from '../lib/companyUtils'
import { isDatePassee } from '../lib/constants'

const VIEWS = [
  { key: 'kanban', label: 'Kanban' },
  { key: 'list', label: 'Liste' },
]

const emptyFilters = { source: '', temperature: '', lateOnly: false }

export default function PipelinePage() {
  const [view, setView] = useState('kanban')
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)

  const { data: allCompanies, isLoading, isError, error } = useCompanies({
    statuses: ['prospect'],
    source: filters.source,
    temperature: filters.temperature,
  })
  const updateCompany = useUpdateCompany()

  const companies = useMemo(() => {
    if (!allCompanies) return []
    if (!filters.lateOnly) return allCompanies
    return allCompanies.filter((company) => isDatePassee(company.date_prochaine_action))
  }, [allCompanies, filters.lateOnly])

  async function handleStatusChange(company, newStatut) {
    await updateCompany.mutateAsync({
      id: company.id,
      values: buildStatutProspectUpdate(newStatut),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Pipeline</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        <PipelineFilters filters={filters} onChange={setFilters} />

        <div className="flex shrink-0 rounded-lg border border-neutral-200 bg-white p-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                view === v.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {!isLoading && !isError && (
        <div className="animate-[fadein_150ms_ease-out]" key={view}>
          {view === 'kanban' && (
            <PipelineKanban
              companies={companies}
              onCompanyClick={(company) => setSelectedCompanyId(company.id)}
              onStatusChange={handleStatusChange}
            />
          )}
          {view === 'list' && (
            <PipelineListView
              companies={companies}
              onCompanyClick={(company) => setSelectedCompanyId(company.id)}
            />
          )}
        </div>
      )}

      {selectedCompanyId && (
        <ProspectPanel
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
          onDeleted={() => setSelectedCompanyId(null)}
        />
      )}
    </div>
  )
}
