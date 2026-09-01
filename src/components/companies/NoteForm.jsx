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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="auteur" className="block text-sm font-medium text-neutral-700">
            Auteur *
          </label>
          <input
            id="auteur"
            value={values.auteur}
            onChange={(event) => update('auteur', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
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
            {NOTE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="contenu" className="block text-sm font-medium text-neutral-700">
          Contenu *
        </label>
        <textarea
          id="contenu"
          rows={4}
          value={values.contenu}
          onChange={(event) => update('contenu', event.target.value)}
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
