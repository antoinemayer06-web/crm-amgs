import { useState } from 'react'
import {
  COMPANY_SOURCES,
  COMPANY_STATUSES,
  HEALTH_SCORES,
} from '../../lib/constants'

const emptyValues = {
  name: '',
  status: 'prospect',
  sector: '',
  size: '',
  source: '',
  health_score: '',
  tags: '',
  website: '',
  notes_generales: '',
}

export default function CompanyForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({
    ...emptyValues,
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
      health_score: values.status === 'client' ? values.health_score || null : null,
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
            {COMPANY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="health_score" className="block text-sm font-medium text-neutral-700">
            Health score
          </label>
          <select
            id="health_score"
            value={values.health_score}
            disabled={values.status !== 'client'}
            onChange={(event) => update('health_score', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            <option value="">—</option>
            {HEALTH_SCORES.map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </div>
      </div>

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
