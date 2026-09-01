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
        <label htmlFor="nom" className="block text-sm font-medium text-neutral-700">
          Nom *
        </label>
        <input
          id="nom"
          value={values.nom}
          onChange={(event) => update('nom', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="objectif" className="block text-sm font-medium text-neutral-700">
          Objectif
        </label>
        <textarea
          id="objectif"
          rows={2}
          value={values.objectif}
          onChange={(event) => update('objectif', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="date_debut" className="block text-sm font-medium text-neutral-700">
            Date de début
          </label>
          <input
            id="date_debut"
            type="date"
            value={values.date_debut}
            onChange={(event) => update('date_debut', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date_fin" className="block text-sm font-medium text-neutral-700">
            Date de fin
          </label>
          <input
            id="date_fin"
            type="date"
            value={values.date_fin}
            onChange={(event) => update('date_fin', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="budget" className="block text-sm font-medium text-neutral-700">
            Budget (€)
          </label>
          <input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={values.budget}
            onChange={(event) => update('budget', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="statut" className="block text-sm font-medium text-neutral-700">
            Statut
          </label>
          <select
            id="statut"
            value={values.statut}
            onChange={(event) => update('statut', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
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
