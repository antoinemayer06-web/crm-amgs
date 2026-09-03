import { useState } from 'react'
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from '../../hooks/useNotes'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import NoteForm from './NoteForm'

const formatDate = (value) =>
  new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

export default function NotesTab({ companyId }) {
  const [modalMode, setModalMode] = useState(null) // null | 'create' | note object
  const { data: notes, isLoading, isError, error } = useNotes(companyId)
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  async function handleDelete(note) {
    if (!window.confirm('Supprimer cette note ?')) return
    await deleteNote.mutateAsync({ id: note.id, companyId })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Ajouter une note
        </button>
      </div>

      {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}
      {!isLoading && !isError && notes.length === 0 && (
        <p className="text-sm text-ink-secondary">Aucune note pour cette entreprise.</p>
      )}

      <ul className="space-y-3">
        {notes?.map((note) => (
          <li key={note.id} className="rounded-lg border border-chrome-dark bg-surface p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge>{note.type}</Badge>
                <span className="text-sm font-medium text-ink">{note.auteur}</span>
                <span className="text-xs text-ink-tertiary">{formatDate(note.created_at)}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setModalMode(note)}
                  className="text-ink-secondary hover:text-ink"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(note)}
                  className="text-red-500 hover:text-red-400"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <p className="text-selectable mt-2 whitespace-pre-wrap text-sm text-ink-secondary">{note.contenu}</p>
          </li>
        ))}
      </ul>

      {modalMode === 'create' && (
        <Modal title="Ajouter une note" onClose={() => setModalMode(null)}>
          <NoteForm
            submitting={createNote.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await createNote.mutateAsync({ ...values, company_id: companyId })
              setModalMode(null)
            }}
          />
        </Modal>
      )}

      {modalMode && modalMode !== 'create' && (
        <Modal title="Modifier la note" onClose={() => setModalMode(null)}>
          <NoteForm
            initialValues={modalMode}
            submitting={updateNote.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await updateNote.mutateAsync({ id: modalMode.id, values })
              setModalMode(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
