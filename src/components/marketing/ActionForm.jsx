import { useState } from 'react'
import {
  MARKETING_ACTION_STATUSES,
  MARKETING_ACTION_TYPES,
  formatEnumLabel,
} from '../../lib/constants'

const emptyValues = {
  titre: '',
  type: 'post_linkedin',
  statut: 'planifié',
  date_prevue: '',
  campaign_id: '',
  description: '',
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

export default function ActionForm({
  initialValues,
  defaultDate,
  defaultCampaignId,
  campaigns,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [values, setValues] = useState({
    ...emptyValues,
    date_prevue: defaultDate ?? emptyValues.date_prevue,
    campaign_id: defaultCampaignId ?? emptyValues.campaign_id,
    ...toFormValues(initialValues),
  })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.titre.trim()) {
      setError('Le titre est obligatoire.')
      return
    }

    const payload = {
      titre: values.titre.trim(),
      type: values.type,
      statut: values.statut,
      date_prevue: values.date_prevue || null,
      campaign_id: values.campaign_id || null,
      description: values.description.trim() || null,
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
        <label htmlFor="titre" className="block text-sm font-medium text-neutral-700">
          Titre *
        </label>
        <input
          id="titre"
          value={values.titre}
          onChange={(event) => update('titre', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700">
            Type
          </label>
          <select
            id="type"
            value={values.type}
            onChange={(event) => update('type', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            {MARKETING_ACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEnumLabel(type)}
              </option>
            ))}
          </select>
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
            {MARKETING_ACTION_STATUSES.map((statut) => (
              <option key={statut} value={statut}>
                {formatEnumLabel(statut)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="date_prevue" className="block text-sm font-medium text-neutral-700">
            Date prévue
          </label>
          <input
            id="date_prevue"
            type="date"
            value={values.date_prevue}
            onChange={(event) => update('date_prevue', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="campaign_id" className="block text-sm font-medium text-neutral-700">
            Campagne
          </label>
          <select
            id="campaign_id"
            value={values.campaign_id}
            onChange={(event) => update('campaign_id', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            <option value="">Aucune</option>
            {campaigns?.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
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
