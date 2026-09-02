import { useState } from 'react'

const emptyValues = {
  first_name: '',
  last_name: '',
  role: '',
  email: '',
  phone: '',
  is_primary: false,
}

export default function ContactForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues })
  const [error, setError] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!values.first_name.trim() || !values.last_name.trim()) {
      setError('Le prénom et le nom sont obligatoires.')
      return
    }

    const payload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      role: values.role.trim() || null,
      email: values.email.trim() || null,
      phone: values.phone.trim() || null,
      is_primary: values.is_primary,
    }

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="first_name" className="block text-sm font-medium text-ink-secondary">
            Prénom *
          </label>
          <input
            id="first_name"
            value={values.first_name}
            onChange={(event) => update('first_name', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="last_name" className="block text-sm font-medium text-ink-secondary">
            Nom *
          </label>
          <input
            id="last_name"
            value={values.last_name}
            onChange={(event) => update('last_name', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="block text-sm font-medium text-ink-secondary">
          Fonction
        </label>
        <input
          id="role"
          value={values.role}
          onChange={(event) => update('role', event.target.value)}
          className="w-full input-chrome"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-ink-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-ink-secondary">
            Téléphone
          </label>
          <input
            id="phone"
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            className="w-full input-chrome"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        <input
          type="checkbox"
          checked={values.is_primary}
          onChange={(event) => update('is_primary', event.target.checked)}
          className="rounded border-chrome-dark"
        />
        Contact principal
      </label>

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
