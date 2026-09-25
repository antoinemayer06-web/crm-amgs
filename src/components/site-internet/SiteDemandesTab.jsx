import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import SidePanel from '../ui/SidePanel'
import CompanyForm from '../companies/CompanyForm'
import { useCreateCompany } from '../../hooks/useCompanies'
import { useCreateContact } from '../../hooks/useContacts'
import { useDeleteSiteLead, useSiteLeads, useUpdateSiteLead } from '../../hooks/useSiteInternet'

const STATUT_OPTIONS = ['Nouveau', 'Contacté', 'Converti', 'Rejeté']

function scoreTone(score) {
  if (score === null || score === undefined) return 'neutral'
  if (score >= 70) return 'green'
  if (score >= 40) return 'amber'
  return 'red'
}

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

function splitName(nom) {
  const trimmed = (nom ?? '').trim()
  if (!trimmed) return { first_name: 'Contact', last_name: 'site web' }
  const [first, ...rest] = trimmed.split(/\s+/)
  return { first_name: first, last_name: rest.join(' ') || '—' }
}

function ConvertToProspectModal({ lead, onClose, onConverted }) {
  const createCompany = useCreateCompany()
  const createContact = useCreateContact()
  const [submitting, setSubmitting] = useState(false)

  const initialValues = {
    name: lead.nom || lead.email,
    source: 'site_web',
    contact: lead.telephone || lead.email,
    notes_generales: `Issu du quiz du site — score ${lead.score ?? 'N/A'}.\n\n${Object.entries(
      lead.reponses ?? {},
    )
      .map(([question, reponse]) => `${question} : ${reponse}`)
      .join('\n')}`,
  }

  async function handleSubmit(values) {
    setSubmitting(true)
    try {
      const company = await createCompany.mutateAsync(values)
      if (lead.email || lead.telephone) {
        const { first_name, last_name } = splitName(lead.nom)
        await createContact.mutateAsync({
          company_id: company.id,
          first_name,
          last_name,
          email: lead.email || null,
          phone: lead.telephone || null,
          is_primary: true,
        })
      }
      onConverted(company)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Convertir en prospect" onClose={onClose}>
      <CompanyForm
        initialValues={initialValues}
        defaultStatus="prospect"
        submitting={submitting}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

function LeadDetailPanel({ lead, onClose }) {
  const navigate = useNavigate()
  const updateLead = useUpdateSiteLead()
  const deleteLead = useDeleteSiteLead()
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState({ nom: lead.nom ?? '', email: lead.email, telephone: lead.telephone ?? '' })
  const [converting, setConverting] = useState(false)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSaveEdit() {
    await updateLead.mutateAsync({
      id: lead.id,
      values: { nom: values.nom.trim() || null, email: values.email.trim(), telephone: values.telephone.trim() || null },
    })
    setEditing(false)
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer la demande de « ${lead.nom || lead.email} » ?`)) return
    await deleteLead.mutateAsync(lead.id)
    onClose()
  }

  function handleConverted(company) {
    setConverting(false)
    onClose()
    navigate(`/companies/${company.id}`)
  }

  return (
    <SidePanel title="Détail de la demande" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={scoreTone(lead.score)}>Score {lead.score ?? 'N/A'}</Badge>
          <select
            value={lead.statut}
            onChange={(event) => updateLead.mutate({ id: lead.id, values: { statut: event.target.value } })}
            className="input-chrome w-auto text-sm"
          >
            {STATUT_OPTIONS.map((statut) => (
              <option key={statut} value={statut}>
                {statut}
              </option>
            ))}
          </select>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Nom</label>
              <input value={values.nom} onChange={(e) => update('nom', e.target.value)} className="w-full input-chrome" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Email</label>
              <input value={values.email} onChange={(e) => update('email', e.target.value)} className="w-full input-chrome" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Téléphone</label>
              <input value={values.telephone} onChange={(e) => update('telephone', e.target.value)} className="w-full input-chrome" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1 text-sm">
                Annuler
              </button>
              <button type="button" onClick={handleSaveEdit} disabled={updateLead.isPending} className="btn-primary flex-1 text-sm">
                Enregistrer
              </button>
            </div>
          </div>
        ) : (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-ink-tertiary">Nom</dt>
              <dd className="text-ink">{lead.nom || '—'}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-ink-tertiary">Email</dt>
              <dd className="text-ink">{lead.email}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-ink-tertiary">Téléphone</dt>
              <dd className="text-ink">{lead.telephone || '—'}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-ink-tertiary">Soumis le</dt>
              <dd className="text-ink">{formatDate(lead.date_soumission)}</dd>
            </div>
          </dl>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Réponses au quiz</p>
          <ul className="divide-y divide-chrome-dark rounded-lg border border-chrome-dark">
            {Object.entries(lead.reponses ?? {}).map(([question, reponse]) => (
              <li key={question} className="px-3 py-2 text-sm">
                <p className="text-xs text-ink-tertiary">{question}</p>
                <p className="text-ink">{String(reponse)}</p>
              </li>
            ))}
            {Object.keys(lead.reponses ?? {}).length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-secondary">Aucune réponse détaillée.</li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-chrome-dark pt-4 sm:flex-row">
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="btn-secondary flex-1 text-sm">
              Modifier
            </button>
          )}
          <button type="button" onClick={handleDelete} className="flex-1 rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
            Supprimer
          </button>
          <button type="button" onClick={() => setConverting(true)} className="btn-primary flex-1 text-sm">
            Convertir en prospect
          </button>
        </div>
      </div>

      {converting && (
        <ConvertToProspectModal lead={lead} onClose={() => setConverting(false)} onConverted={handleConverted} />
      )}
    </SidePanel>
  )
}

export default function SiteDemandesTab({ openLeadId }) {
  const { data: leads, isLoading, isError, error } = useSiteLeads()
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (openLeadId) setSelectedId(openLeadId)
  }, [openLeadId])

  if (isLoading) return <p className="text-sm text-ink-secondary">Chargement…</p>
  if (isError) return <p className="text-sm font-medium text-red-400">Erreur : {error.message}</p>

  const sorted = [...(leads ?? [])].sort((a, b) => {
    const diff = new Date(a.date_soumission) - new Date(b.date_soumission)
    return sortAsc ? diff : -diff
  })

  const selectedLead = sorted.find((lead) => lead.id === selectedId)

  return (
    <div className="space-y-3">
      {sorted.length === 0 ? (
        <p className="rounded-lg border border-chrome-dark p-6 text-center text-sm text-ink-secondary">
          Aucune demande reçue pour le moment.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-chrome-dark">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover text-left text-xs text-ink-tertiary">
              <tr>
                <th className="px-3 py-2">
                  <button type="button" onClick={() => setSortAsc((prev) => !prev)} className="hover:text-ink-secondary">
                    Date {sortAsc ? '↑' : '↓'}
                  </button>
                </th>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chrome-dark">
              {sorted.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className="cursor-pointer hover:bg-surface-hover"
                >
                  <td className="whitespace-nowrap px-3 py-2 text-ink-secondary">{formatDate(lead.date_soumission)}</td>
                  <td className="px-3 py-2 text-ink">{lead.nom || '—'}</td>
                  <td className="px-3 py-2 text-ink-secondary">{lead.email}</td>
                  <td className="px-3 py-2">
                    <Badge tone={scoreTone(lead.score)}>{lead.score ?? 'N/A'}</Badge>
                  </td>
                  <td className="px-3 py-2 text-ink-secondary">{lead.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
