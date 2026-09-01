import { useState } from 'react'
import { useCompanies } from '../../hooks/useCompanies'

const emptyValues = {
  name: '',
  company_id: '',
  date_debut: '',
  date_livraison_prevue: '',
  description: '',
}

export default function ProjectForm({ onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(emptyValues)
  const [error, setError] = useState(null)
  const { data: clients } = useCompanies({ statuses: ['client'] })

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError('Le nom du projet est obligatoire.')
      return
    }
    if (!values.company_id) {
      setError('Sélectionnez un client.')
      return
    }

    try {
      await onSubmit({
        nom: values.name.trim(),
        company_id: values.company_id,
        date_debut: values.date_debut || null,
        date_livraison_prevue: values.date_livraison_prevue || null,
        description: values.description.trim() || null,
      })
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
          Nom du projet *
        </label>
        <input
          id="name"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="company_id" className="block text-sm font-medium text-neutral-700">
          Client *
        </label>
        <select
          id="company_id"
          value={values.company_id}
          onChange={(event) => update('company_id', event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        >
          <option value="">Sélectionner un client…</option>
          {clients?.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
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
          <label htmlFor="date_livraison_prevue" className="block text-sm font-medium text-neutral-700">
            Échéance
          </label>
          <input
            id="date_livraison_prevue"
            type="date"
            value={values.date_livraison_prevue}
            onChange={(event) => update('date_livraison_prevue', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
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
          {submitting ? 'Création…' : 'Créer le projet'}
        </button>
      </div>
    </form>
  )
}
