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
  statut_prospect: '',
  statut_livraison: '',
  temperature: '',
  tags: '',
  website: '',
  notes_generales: '',
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
    ...initialValues,
    tags: (initialValues?.tags ?? []).join(', '),
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

    const payload = {
      name: values.name.trim(),
      status: values.status,
      sector: values.sector.trim() || null,
      size: values.size.trim() || null,
      source: values.source || null,
      statut_prospect:
        values.status === 'prospect' ? values.statut_prospect || 'à_contacter' : null,
      statut_livraison:
        values.status === 'client' ? values.statut_livraison || 'en_cours' : null,
      temperature: values.status === 'client' ? values.temperature || 'chaud' : null,
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      website: values.website.trim() || null,
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

      {values.status === 'prospect' && (
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
              {TEMPERATURE_OPTIONS.map((temp) => (
                <option key={temp} value={temp}>
                  {temp}
                </option>
              ))}
            </select>
          </div>
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
        <label htmlFor="tags" className="block text-sm font-medium text-neutral-700">
          Tags (séparés par des virgules)
        </label>
        <input
          id="tags"
          value={values.tags}
          onChange={(event) => update('tags', event.target.value)}
          placeholder="ex: agence, saas, prioritaire"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
          Site web
        </label>
        <input
          id="website"
          value={values.website}
          onChange={(event) => update('website', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
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
