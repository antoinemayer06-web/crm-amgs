import { useState } from 'react'
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_CATEGORY_LABELS } from '../../lib/constants'
import MarkdownEditor from './MarkdownEditor'

const emptyValues = {
  titre: '',
  categorie: 'script_appel',
  contenu: '',
  tagsText: '',
}

// Les valeurs nullable (contenu) arrivent en `null` depuis Supabase : on
// les normalise en chaîne vide pour que `.trim()` ne plante jamais à
// l'enregistrement d'une fiche existante.
function toFormValues(initialValues) {
  if (!initialValues) return {}
  return {
    titre: initialValues.titre ?? '',
    categorie: initialValues.categorie ?? emptyValues.categorie,
    contenu: initialValues.contenu ?? '',
    tagsText: (initialValues.tags ?? []).join(', '),
  }
}

export default function KnowledgeForm({ initialValues, defaultCategorie, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState({
    ...emptyValues,
    categorie: defaultCategorie ?? emptyValues.categorie,
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
      categorie: values.categorie,
      contenu: values.contenu.trim() || null,
      tags: values.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-1">
          <label htmlFor="categorie" className="block text-sm font-medium text-neutral-700">
            Catégorie
          </label>
          <select
            id="categorie"
            value={values.categorie}
            onChange={(event) => update('categorie', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          >
            {KNOWLEDGE_CATEGORIES.map((categorie) => (
              <option key={categorie} value={categorie}>
                {KNOWLEDGE_CATEGORY_LABELS[categorie]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700">Contenu</label>
        <MarkdownEditor value={values.contenu} onChange={(value) => update('contenu', value)} />
      </div>

      <div className="space-y-1">
        <label htmlFor="tags" className="block text-sm font-medium text-neutral-700">
          Tags
        </label>
        <input
          id="tags"
          value={values.tagsText}
          onChange={(event) => update('tagsText', event.target.value)}
          placeholder="ex : prospection, b2b, appel à froid"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <p className="text-xs text-neutral-400">Séparez les tags par des virgules.</p>
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
