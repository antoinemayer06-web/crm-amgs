import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import KnowledgeForm from '../components/knowledge/KnowledgeForm'
import MarkdownContent from '../components/knowledge/MarkdownContent'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import {
  useDeleteKnowledgeEntry,
  useKnowledgeEntry,
  useUpdateKnowledgeEntry,
} from '../hooks/useKnowledgeBase'
import { KNOWLEDGE_CATEGORY_LABELS, KNOWLEDGE_CATEGORY_TONES } from '../lib/constants'

export default function KnowledgeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const { data: entry, isLoading, isError, error } = useKnowledgeEntry(id)
  const updateEntry = useUpdateKnowledgeEntry()
  const deleteEntry = useDeleteKnowledgeEntry()

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Chargement…</p>
  }

  if (isError) {
    return <p className="text-sm text-red-600">Erreur : {error.message}</p>
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer la fiche « ${entry.titre} » ?`)) return
    await deleteEntry.mutateAsync(entry.id)
    navigate('/knowledge')
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/knowledge" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Base de connaissance
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-neutral-900">{entry.titre}</h2>
          <Badge tone={KNOWLEDGE_CATEGORY_TONES[entry.categorie]}>
            {KNOWLEDGE_CATEGORY_LABELS[entry.categorie]}
          </Badge>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <MarkdownContent content={entry.contenu} />
      </div>

      {editing && (
        <Modal title={`Modifier « ${entry.titre} »`} size="lg" onClose={() => setEditing(false)}>
          <KnowledgeForm
            initialValues={entry}
            submitting={updateEntry.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={async (values) => {
              await updateEntry.mutateAsync({ id: entry.id, values })
              setEditing(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
