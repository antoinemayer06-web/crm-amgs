import { useState } from 'react'
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../../lib/constants'

const emptyValues = { nom: '', type: 'autre', montant: '', statut: '' }

export default function DocumentForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting,
  requireFile = false,
}) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues })
  const [file, setFile] = useState(null)
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
    if (requireFile && !file) {
      setError('Sélectionnez un fichier.')
      return
    }

    const payload = {
      nom: values.nom.trim(),
      type: values.type,
      montant: values.montant === '' ? null : Number(values.montant),
      statut: values.statut || null,
      ...(requireFile ? { file } : {}),
    }

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {requireFile && (
        <div className="space-y-1">
          <label htmlFor="file" className="block text-sm font-medium text-neutral-700">
            Fichier *
          </label>
          <input
            id="file"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>
      )}

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
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
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
            <option value="">—</option>
            {DOCUMENT_STATUSES.map((statut) => (
              <option key={statut} value={statut}>
                {statut}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="montant" className="block text-sm font-medium text-neutral-700">
          Montant (€)
        </label>
        <input
          id="montant"
          type="number"
          step="0.01"
          value={values.montant}
          onChange={(event) => update('montant', event.target.value)}
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
