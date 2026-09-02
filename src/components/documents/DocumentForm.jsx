import { useState } from 'react'
import { DOCUMENT_STATUSES, DOCUMENT_TYPES, formatEnumLabel } from '../../lib/constants'

const today = () => new Date().toISOString().slice(0, 10)

const emptyValues = { nom: '', type: 'autre', montant: '', statut: '', date_document: today() }

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
      date_document: values.date_document || today(),
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
          <label htmlFor="file" className="block text-sm font-medium text-ink-secondary">
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
            {DOCUMENT_TYPES.map((type) => (
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
            <option value="">—</option>
            {DOCUMENT_STATUSES.map((statut) => (
              <option key={statut} value={statut}>
                {formatEnumLabel(statut)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="montant" className="block text-sm font-medium text-ink-secondary">
            Montant (€)
          </label>
          <input
            id="montant"
            type="number"
            step="0.01"
            value={values.montant}
            onChange={(event) => update('montant', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="date_document" className="block text-sm font-medium text-ink-secondary">
            Date du document
          </label>
          <input
            id="date_document"
            type="date"
            value={values.date_document}
            onChange={(event) => update('date_document', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
