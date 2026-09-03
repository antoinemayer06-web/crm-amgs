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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label htmlFor="categorie" className="block text-sm font-medium text-ink-secondary">
            Catégorie
          </label>
          <select
            id="categorie"
            value={values.categorie}
            onChange={(event) => update('categorie', event.target.value)}
            className="w-full input-chrome"
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
        <label className="block text-sm font-medium text-ink-secondary">Contenu</label>
        <MarkdownEditor value={values.contenu} onChange={(value) => update('contenu', value)} />
      </div>

      <div className="space-y-1">
        <label htmlFor="tags" className="block text-sm font-medium text-ink-secondary">
          Tags
        </label>
        <input
          id="tags"
          value={values.tagsText}
          onChange={(event) => update('tagsText', event.target.value)}
          placeholder="ex : prospection, b2b, appel à froid"
          className="w-full input-chrome"
        />
        <p className="text-xs text-ink-tertiary">Séparez les tags par des virgules.</p>
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
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
