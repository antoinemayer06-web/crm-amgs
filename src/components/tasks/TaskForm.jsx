import { useState } from 'react'
import { TASK_PRIORITE_LABELS, TASK_PRIORITE_OPTIONS } from '../../lib/constants'

const emptyValues = {
  titre: '',
  description: '',
  company_id: '',
  due_date: '',
  priorite: 'moyenne',
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

export default function TaskForm({ initialValues, companies, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({ ...emptyValues, ...toFormValues(initialValues) })
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
      description: values.description.trim() || null,
      company_id: values.company_id || null,
      due_date: values.due_date || null,
      priorite: values.priorite,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="due_date" className="block text-sm font-medium text-ink-secondary">
            Échéance
          </label>
          <input
            id="due_date"
            type="date"
            value={values.due_date}
            onChange={(event) => update('due_date', event.target.value)}
            className="w-full input-chrome"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="priorite" className="block text-sm font-medium text-ink-secondary">
            Priorité
          </label>
          <select
            id="priorite"
            value={values.priorite}
            onChange={(event) => update('priorite', event.target.value)}
            className="w-full input-chrome"
          >
            {TASK_PRIORITE_OPTIONS.map((priorite) => (
              <option key={priorite} value={priorite}>
                {TASK_PRIORITE_LABELS[priorite]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="company_id" className="block text-sm font-medium text-ink-secondary">
          Entreprise liée
        </label>
        <select
          id="company_id"
          value={values.company_id}
          onChange={(event) => update('company_id', event.target.value)}
          className="w-full input-chrome"
        >
          <option value="">Aucune</option>
          {companies?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
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
        <button type="submit" disabled={submitting} className="w-full btn-primary sm:w-auto">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
