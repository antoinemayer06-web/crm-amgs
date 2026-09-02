import { useState } from 'react'
import ContactsTab from '../companies/ContactsTab'
import CompanyForm from '../companies/CompanyForm'
import InfosTab from '../companies/InfosTab'
import NotesTab from '../companies/NotesTab'
import DocumentsTab from '../companies/DocumentsTab'
import { useCompany, useDeleteCompany, useUpdateCompany } from '../../hooks/useCompanies'
import { buildStatutProspectUpdate } from '../../lib/companyUtils'
import {
  STATUT_PROSPECT_OPTIONS,
  STATUT_PROSPECT_TONES,
  TEMPERATURE_OPTIONS,
  TEMPERATURE_TONES,
} from '../../lib/constants'
import InlineSelect from '../ui/InlineSelect'
import Modal from '../ui/Modal'
import SidePanel from '../ui/SidePanel'

const TABS = [
  { key: 'infos', label: 'Infos générales' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'notes', label: 'Notes' },
  { key: 'documents', label: 'Documents' },
]

export default function ProspectPanel({ companyId, onClose, onDeleted }) {
  const [activeTab, setActiveTab] = useState('infos')
  const [editing, setEditing] = useState(false)
  const { data: company, isLoading } = useCompany(companyId)
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()

  async function handleStatutChange(newValue) {
    await updateCompany.mutateAsync({ id: companyId, values: buildStatutProspectUpdate(newValue) })
  }

  async function handleTemperatureChange(newValue) {
    await updateCompany.mutateAsync({ id: companyId, values: { temperature: newValue } })
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer « ${company.name} » et toutes ses données liées ?`)) return
    await deleteCompany.mutateAsync(companyId)
    onDeleted?.()
    onClose()
  }

  return (
    <SidePanel title={isLoading ? 'Chargement…' : company?.name} onClose={onClose}>
      {isLoading || !company ? (
        <p className="text-sm text-ink-secondary">Chargement…</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <InlineSelect
              value={company.statut_prospect}
              options={STATUT_PROSPECT_OPTIONS}
              toneMap={STATUT_PROSPECT_TONES}
              onChange={handleStatutChange}
            />
            <InlineSelect
              value={company.temperature}
              options={TEMPERATURE_OPTIONS}
              toneMap={TEMPERATURE_TONES}
              onChange={handleTemperatureChange}
            />
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
              className="rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover hover:text-ink"
            >
              Supprimer
            </button>
          </div>

          <div className="border-b border-chrome-dark">
            <nav className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`border-b-2 px-3 py-2 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'border-chrome-light text-ink'
                      : 'border-transparent text-ink-secondary hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {activeTab === 'infos' && <InfosTab company={company} />}
            {activeTab === 'contacts' && <ContactsTab companyId={companyId} />}
            {activeTab === 'notes' && <NotesTab companyId={companyId} />}
            {activeTab === 'documents' && <DocumentsTab companyId={companyId} />}
          </div>

          {editing && (
            <Modal title={`Modifier « ${company.name} »`} onClose={() => setEditing(false)}>
              <CompanyForm
                initialValues={company}
                submitting={updateCompany.isPending}
                onCancel={() => setEditing(false)}
                onSubmit={async (values) => {
                  await updateCompany.mutateAsync({ id: companyId, values })
                  setEditing(false)
                }}
              />
            </Modal>
          )}
        </div>
      )}
    </SidePanel>
  )
}
