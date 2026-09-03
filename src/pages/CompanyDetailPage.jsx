import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CompanyForm from '../components/companies/CompanyForm'
import ContactsTab from '../components/companies/ContactsTab'
import DocumentsTab from '../components/companies/DocumentsTab'
import InfosTab from '../components/companies/InfosTab'
import NotesTab from '../components/companies/NotesTab'
import ProjectsTab from '../components/companies/ProjectsTab'
import RecurringInvoicesTab from '../components/companies/RecurringInvoicesTab'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { useCompany, useDeleteCompany, useUpdateCompany } from '../hooks/useCompanies'
import { useProjectsByCompany } from '../hooks/useProjects'
import { useAiChat } from '../lib/AiChatContext'
import { COMPANY_STATUS_TONES, formatEnumLabel } from '../lib/constants'

const TABS = [
  { key: 'infos', label: 'Infos générales' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'notes', label: 'Notes' },
  { key: 'documents', label: 'Documents' },
  { key: 'recurring_invoices', label: 'Factures récurrentes' },
  { key: 'projects', label: 'Projets liés' },
]

export default function CompanyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('infos')
  const [editing, setEditing] = useState(false)
  const { data: company, isLoading, isError, error } = useCompany(id)
  const { data: projects } = useProjectsByCompany(id)
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()
  const { setEntityContext } = useAiChat()

  useEffect(() => {
    if (!company) return
    setEntityContext({ type: 'company', id: company.id, label: company.name })
    return () => setEntityContext(null)
  }, [company, setEntityContext])

  if (isLoading) {
    return <p className="text-sm text-ink-secondary">Chargement…</p>
  }

  if (isError) {
    return <p className="text-sm text-red-600">Erreur : {error.message}</p>
  }

  const actif = (projects ?? []).some(
    (project) => !project.archived && project.statut === 'en_cours_livraison',
  )

  async function handleDelete() {
    if (!window.confirm(`Supprimer « ${company.name} » et toutes ses données liées ?`)) {
      return
    }
    await deleteCompany.mutateAsync(company.id)
    navigate('/companies')
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/companies" className="text-sm text-ink-secondary hover:text-ink">
          ← Entreprises
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-ink">{company.name}</h2>
          <Badge tone={COMPANY_STATUS_TONES[company.status]}>{formatEnumLabel(company.status)}</Badge>
          {company.status === 'client' && (
            <Badge tone={actif ? 'green' : 'neutral'}>{actif ? 'Actif' : 'Inactif'}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border-b border-chrome-dark">
        <nav className="flex w-max min-w-full gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium ${
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
        {activeTab === 'infos' && <InfosTab company={company} actif={actif} />}
        {activeTab === 'contacts' && <ContactsTab companyId={company.id} />}
        {activeTab === 'notes' && <NotesTab companyId={company.id} />}
        {activeTab === 'documents' && <DocumentsTab companyId={company.id} />}
        {activeTab === 'recurring_invoices' && <RecurringInvoicesTab companyId={company.id} />}
        {activeTab === 'projects' && <ProjectsTab companyId={company.id} />}
      </div>

      {editing && (
        <Modal title={`Modifier « ${company.name} »`} onClose={() => setEditing(false)}>
          <CompanyForm
            initialValues={company}
            submitting={updateCompany.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={async (values) => {
              await updateCompany.mutateAsync({ id: company.id, values })
              setEditing(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
