import { useState } from 'react'
import {
  MARKETING_ACTION_STATUSES,
  MARKETING_ACTION_TYPES,
  RECURRENCE_FREQUENCES,
  RECURRENCE_FREQUENCE_LABELS,
  formatEnumLabel,
} from '../../lib/constants'

const emptyValues = {
  titre: '',
  type: 'post_linkedin',
  statut: 'planifié',
  date_prevue: '',
  campaign_id: '',
  company_id: '',
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
  companies,
  onSubmit,
  onCancel,
  submitting,
}) {
  const isCreating = !initialValues
  const [values, setValues] = useState({
    ...emptyValues,
    date_prevue: defaultDate ?? emptyValues.date_prevue,
    campaign_id: defaultCampaignId ?? emptyValues.campaign_id,
    ...toFormValues(initialValues),
  })
  const [recurrence, setRecurrence] = useState({ frequence: '', intervalle: '1', fin: '' })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function updateRecurrence(field, value) {
    setRecurrence((prev) => ({ ...prev, [field]: value }))
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
      company_id: values.company_id || null,
      description: values.description.trim() || null,
    }

    if (isCreating && recurrence.frequence) {
      if (!values.date_prevue) {
        setError('La date prévue est obligatoire pour créer une récurrence.')
        return
      }
      if (!recurrence.fin) {
        setError('La date de fin de récurrence est obligatoire.')
        return
      }
      payload.recurrence_frequence = recurrence.frequence
      payload.recurrence_intervalle = Number(recurrence.intervalle) || 1
      payload.recurrence_fin = recurrence.fin
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
        <label htmlFor="titre" className="block text-sm font-medium text-ink-secondary">
          Titre *
        </label>
        <input
          id="titre"
          value={values.titre}
          onChange={(event) => update('titre', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="type" className="block text-sm font-medium text-ink-secondary">
            Type
          </label>
          <select
            id="type"
            value={values.type}
            onChange={(event) => update('type', event.target.value)}
            className="w-full input-chrome"
          >
            {MARKETING_ACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatEnumLabel(type)}
              </option>
            ))}
          </select>
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
          <label htmlFor="date_prevue" className="block text-sm font-medium text-ink-secondary">
            Date prévue
          </label>
          <input
            id="date_prevue"
            type="date"
            value={values.date_prevue}
            onChange={(event) => update('date_prevue', event.target.value)}
            className="w-full input-chrome"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="campaign_id" className="block text-sm font-medium text-ink-secondary">
            Campagne
          </label>
          <select
            id="campaign_id"
            value={values.campaign_id}
            onChange={(event) => update('campaign_id', event.target.value)}
            className="w-full input-chrome"
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
        <label htmlFor="company_id" className="block text-sm font-medium text-ink-secondary">
          Prospect lié
        </label>
        <select
          id="company_id"
          value={values.company_id}
          onChange={(event) => update('company_id', event.target.value)}
          className="w-full input-chrome"
        >
          <option value="">Aucun</option>
          {companies?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-ink-secondary">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      {isCreating && (
        <div className="space-y-2 rounded-md border border-chrome-dark p-3">
          <p className="text-sm font-medium text-ink-secondary">Récurrence (optionnel)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label htmlFor="recurrence_intervalle" className="block text-xs text-ink-secondary">
                Tous les
              </label>
              <input
                id="recurrence_intervalle"
                type="number"
                min="1"
                value={recurrence.intervalle}
                onChange={(event) => updateRecurrence('intervalle', event.target.value)}
                disabled={!recurrence.frequence}
                className="w-full input-chrome disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="recurrence_frequence" className="block text-xs text-ink-secondary">
                Fréquence
              </label>
              <select
                id="recurrence_frequence"
                value={recurrence.frequence}
                onChange={(event) => updateRecurrence('frequence', event.target.value)}
                className="w-full input-chrome"
              >
                <option value="">Pas de récurrence</option>
                {RECURRENCE_FREQUENCES.map((frequence) => (
                  <option key={frequence} value={frequence}>
                    {RECURRENCE_FREQUENCE_LABELS[frequence]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="recurrence_fin" className="block text-xs text-ink-secondary">
                Jusqu'au
              </label>
              <input
                id="recurrence_fin"
                type="date"
                value={recurrence.fin}
                onChange={(event) => updateRecurrence('fin', event.target.value)}
                disabled={!recurrence.frequence}
                className="w-full input-chrome disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-chrome-dark px-3 py-2 text-sm text-ink-secondary hover:bg-surface-hover"
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
