import { useState } from 'react'
import { CAMPAIGN_STATUSES, formatEnumLabel } from '../../lib/constants'

const emptyValues = {
  nom: '',
  objectif: '',
  date_debut: '',
  date_fin: '',
  budget: '',
  statut: 'en_préparation',
}

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

export default function CampaignForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({ ...emptyValues, ...toFormValues(initialValues) })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.nom.trim()) {
      setError('Le nom est obligatoire.')
      return
    }

    const payload = {
      nom: values.nom.trim(),
      objectif: values.objectif.trim() || null,
      date_debut: values.date_debut || null,
      date_fin: values.date_fin || null,
      budget: values.budget !== '' ? Number(values.budget) : null,
      statut: values.statut || null,
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
        <label htmlFor="nom" className="block text-sm font-medium text-ink-secondary">
          Nom *
        </label>
        <input
          id="nom"
          value={values.nom}
          onChange={(event) => update('nom', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="objectif" className="block text-sm font-medium text-ink-secondary">
          Objectif
        </label>
        <textarea
          id="objectif"
          rows={2}
          value={values.objectif}
          onChange={(event) => update('objectif', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="date_debut" className="block text-sm font-medium text-ink-secondary">
            Date de début
          </label>
          <input
            id="date_debut"
            type="date"
            value={values.date_debut}
            onChange={(event) => update('date_debut', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date_fin" className="block text-sm font-medium text-ink-secondary">
            Date de fin
          </label>
          <input
            id="date_fin"
            type="date"
            value={values.date_fin}
            onChange={(event) => update('date_fin', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="budget" className="block text-sm font-medium text-ink-secondary">
            Budget (€)
          </label>
          <input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={values.budget}
            onChange={(event) => update('budget', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="statut" className="block text-sm font-medium text-ink-secondary">
            Statut
          </label>
          <select
            id="statut"
            value={values.statut}
            onChange={(event) => update('statut', event.target.value)}
            className="w-full input-chrome"
          >
            {CAMPAIGN_STATUSES.map((statut) => (
              <option key={statut} value={statut}>
                {formatEnumLabel(statut)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink-secondary hover:bg-surface-hover max-md:min-h-[44px] sm:w-auto"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary sm:w-auto"
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
