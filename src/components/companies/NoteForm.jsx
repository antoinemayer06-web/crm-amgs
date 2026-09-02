import { useState } from 'react'
import { NOTE_TYPES } from '../../lib/constants'

const emptyValues = { auteur: '', type: 'générale', contenu: '' }

export default function NoteForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.auteur.trim() || !values.contenu.trim()) {
      setError('L’auteur et le contenu sont obligatoires.')
      return
    }

    try {
      await onSubmit({
        auteur: values.auteur.trim(),
        type: values.type,
        contenu: values.contenu.trim(),
      })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="auteur" className="block text-sm font-medium text-ink-secondary">
            Auteur *
          </label>
          <input
            id="auteur"
            value={values.auteur}
            onChange={(event) => update('auteur', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
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
            {NOTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="contenu" className="block text-sm font-medium text-ink-secondary">
          Contenu *
        </label>
        <textarea
          id="contenu"
          rows={4}
          value={values.contenu}
          onChange={(event) => update('contenu', event.target.value)}
          className="w-full input-chrome"
        />
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
          className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 max-md:min-h-[44px] sm:w-auto"
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
