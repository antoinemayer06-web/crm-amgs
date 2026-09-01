import { useState } from 'react'
import {
  COMPANY_SOURCES,
  COMPANY_STATUS_OPTIONS,
  STATUT_LIVRAISON_OPTIONS,
  STATUT_PROSPECT_OPTIONS,
  TEMPERATURE_OPTIONS,
} from '../../lib/constants'

const emptyValues = {
  name: '',
  status: 'prospect',
  sector: '',
  size: '',
  source: '',
  contact: '',
  statut_prospect: '',
  statut_livraison: '',
  temperature: '',
  date_contact: '',
  date_echeance: '',
  notes_generales: '',
}

// Les colonnes nullable arrivent en `null` depuis Supabase : on les
// normalise en chaîne vide pour que les <input>/<select> restent
// contrôlés et que `.trim()` ne plante jamais sur une valeur d'édition.
function toFormValues(initialValues) {
  if (!initialValues) return {}
  const values = {}
  for (const key of Object.keys(emptyValues)) {
    if (key in initialValues) {
      values[key] = initialValues[key] ?? ''
    }
  }
  return values
}

export default function CompanyForm({
  initialValues,
  defaultStatus,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [values, setValues] = useState({
    ...emptyValues,
    status: defaultStatus ?? emptyValues.status,
    ...toFormValues(initialValues),
  })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError('Le nom est obligatoire.')
      return
    }

    // Une fois le devis signé, l'entreprise devient automatiquement
    // cliente — aucune action manuelle supplémentaire n'est nécessaire.
    const isConverting = values.status === 'prospect' && values.statut_prospect === 'devis_signé'
    const finalStatus = isConverting ? 'client' : values.status
    const finalStatutProspect =
      finalStatus === 'prospect' ? values.statut_prospect || 'à_contacter' : null
    const finalStatutLivraison =
      finalStatus === 'client'
        ? isConverting
          ? 'en_cours_livraison'
          : values.statut_livraison || 'en_cours_livraison'
        : null

    const payload = {
      name: values.name.trim(),
      status: finalStatus,
      sector: values.sector.trim() || null,
      size: values.size.trim() || null,
      source: values.source || null,
      contact: values.contact.trim() || null,
      statut_prospect: finalStatutProspect,
      statut_livraison: finalStatutLivraison,
      temperature: isConverting ? 'chaud' : values.temperature || null,
      date_contact: finalStatutProspect ? values.date_contact || null : null,
      date_echeance: finalStatutLivraison === 'en_cours_livraison' ? values.date_echeance || null : null,
      notes_generales: values.notes_generales.trim() || null,
    }

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
          Nom *
        </label>
        <input
          id="name"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
            Statut
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(event) => update('status', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            {COMPANY_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="temperature" className="block text-sm font-medium text-neutral-700">
            Température
          </label>
          <select
            id="temperature"
            value={values.temperature}
            onChange={(event) => update('temperature', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            <option value="">—</option>
            {TEMPERATURE_OPTIONS.map((temp) => (
              <option key={temp} value={temp}>
                {temp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {values.status === 'prospect' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="statut_prospect" className="block text-sm font-medium text-neutral-700">
              Étape prospect
            </label>
            <select
              id="statut_prospect"
              value={values.statut_prospect}
              onChange={(event) => update('statut_prospect', event.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            >
              {STATUT_PROSPECT_OPTIONS.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </div>
          {values.statut_prospect === 'contacté' && (
            <div className="space-y-1">
              <label htmlFor="date_contact" className="block text-sm font-medium text-neutral-700">
                Date de contact
              </label>
              <input
                id="date_contact"
                type="date"
                value={values.date_contact}
                onChange={(event) => update('date_contact', event.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
          )}
        </div>
      )}

      {values.status === 'client' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="statut_livraison"
              className="block text-sm font-medium text-neutral-700"
            >
              Statut livraison
            </label>
            <select
              id="statut_livraison"
              value={values.statut_livraison}
              onChange={(event) => update('statut_livraison', event.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            >
              {STATUT_LIVRAISON_OPTIONS.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </div>
          {values.statut_livraison === 'en_cours_livraison' && (
            <div className="space-y-1">
              <label htmlFor="date_echeance" className="block text-sm font-medium text-neutral-700">
                Date d'échéance
              </label>
              <input
                id="date_echeance"
                type="date"
                value={values.date_echeance}
                onChange={(event) => update('date_echeance', event.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="sector" className="block text-sm font-medium text-neutral-700">
            Secteur
          </label>
          <input
            id="sector"
            value={values.sector}
            onChange={(event) => update('sector', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="size" className="block text-sm font-medium text-neutral-700">
            Taille
          </label>
          <input
            id="size"
            value={values.size}
            onChange={(event) => update('size', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="source" className="block text-sm font-medium text-neutral-700">
            Source
          </label>
          <select
            id="source"
            value={values.source}
            onChange={(event) => update('source', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            <option value="">—</option>
            {COMPANY_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="contact" className="block text-sm font-medium text-neutral-700">
            Contact
          </label>
          <input
            id="contact"
            value={values.contact}
            onChange={(event) => update('contact', event.target.value)}
            placeholder="téléphone, email…"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes_generales" className="block text-sm font-medium text-neutral-700">
          Notes générales
        </label>
        <textarea
          id="notes_generales"
          rows={3}
          value={values.notes_generales}
          onChange={(event) => update('notes_generales', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
