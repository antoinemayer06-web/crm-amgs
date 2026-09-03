import { useState } from 'react'
import {
  useCreateProjectTestimonial,
  useDeleteProjectTestimonial,
  useProjectTestimonials,
} from '../../hooks/useProjectTestimonials'

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')

function Stars({ note }) {
  if (!note) return null
  return (
    <span className="text-ink-secondary" aria-label={`${note} sur 5`}>
      {'★'.repeat(note)}
      <span className="text-ink-tertiary">{'★'.repeat(5 - note)}</span>
    </span>
  )
}

export default function ProjectTestimonialsTab({ projectId }) {
  const [adding, setAdding] = useState(false)
  const [auteur, setAuteur] = useState('')
  const [contenu, setContenu] = useState('')
  const [note, setNote] = useState('5')
  const { data: testimonials, isLoading, isError, error } = useProjectTestimonials(projectId)
  const createTestimonial = useCreateProjectTestimonial()
  const deleteTestimonial = useDeleteProjectTestimonial()

  async function handleAdd(event) {
    event.preventDefault()
    if (!auteur.trim() || !contenu.trim()) return
    await createTestimonial.mutateAsync({
      projectId,
      auteur: auteur.trim(),
      contenu: contenu.trim(),
      note: note ? Number(note) : null,
    })
    setAuteur('')
    setContenu('')
    setNote('5')
    setAdding(false)
  }

  async function handleDelete(testimonial) {
    if (!window.confirm(`Supprimer le témoignage de « ${testimonial.auteur} » ?`)) return
    await deleteTestimonial.mutateAsync({ id: testimonial.id, projectId })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setAdding((prev) => !prev)} className="btn-secondary text-sm">
          + Ajouter un témoignage
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="space-y-3 rounded-md border border-chrome-dark p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Auteur (client)</label>
              <input
                value={auteur}
                onChange={(event) => setAuteur(event.target.value)}
                className="w-full input-chrome"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-secondary">Note</label>
              <select value={note} onChange={(event) => setNote(event.target.value)} className="w-full input-chrome">
                <option value="">—</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-ink-secondary">Témoignage</label>
            <textarea
              rows={3}
              value={contenu}
              onChange={(event) => setContenu(event.target.value)}
              className="w-full input-chrome"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">
              Annuler
            </button>
            <button type="submit" disabled={createTestimonial.isPending} className="btn-primary text-sm">
              Ajouter
            </button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
      {isError && <p className="text-sm font-medium text-red-400">Erreur : {error.message}</p>}
      {!isLoading && !isError && testimonials.length === 0 && (
        <p className="text-sm text-ink-tertiary">Aucun témoignage pour ce projet pour l'instant.</p>
      )}

      <ul className="space-y-3">
        {testimonials?.map((testimonial) => (
          <li key={testimonial.id} className="card-glass rounded-lg p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-ink">{testimonial.auteur}</p>
                <p className="text-xs text-ink-tertiary">{formatDate(testimonial.created_at)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Stars note={testimonial.note} />
                <button
                  type="button"
                  onClick={() => handleDelete(testimonial)}
                  className="text-ink-tertiary hover:text-red-400"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-selectable mt-2 whitespace-pre-wrap text-sm text-ink-secondary">
              {testimonial.contenu}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
