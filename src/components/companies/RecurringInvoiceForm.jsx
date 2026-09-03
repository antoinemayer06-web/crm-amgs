import { useState } from 'react'
import { RECURRENCE_FREQUENCES, RECURRENCE_FREQUENCE_LABELS } from '../../lib/constants'

const today = () => new Date().toISOString().slice(0, 10)

const emptyValues = { nom: '', montant: '', date_prevue: today() }

export default function RecurringInvoiceForm({ onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(emptyValues)
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

    if (!values.nom.trim()) {
      setError('Le libellé est obligatoire.')
      return
    }
    if (values.montant === '' || Number(values.montant) <= 0) {
      setError('Le montant doit être un nombre positif.')
      return
    }

    const payload = {
      nom: values.nom.trim(),
      montant: Number(values.montant),
      date_prevue: values.date_prevue || today(),
    }

    if (recurrence.frequence) {
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
        <label htmlFor="nom" className="block text-sm font-medium text-ink-secondary">
          Libellé *
        </label>
        <input
          id="nom"
          value={values.nom}
          onChange={(event) => update('nom', event.target.value)}
          placeholder="ex : Abonnement mensuel, Maintenance…"
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="montant" className="block text-sm font-medium text-ink-secondary">
            Montant (€) *
          </label>
          <input
            id="montant"
            type="number"
            step="0.01"
            min="0"
            value={values.montant}
            onChange={(event) => update('montant', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
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
      </div>

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
          {submitting ? 'Enregistrement…' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}
