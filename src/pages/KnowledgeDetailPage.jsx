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
    return <p className="text-sm text-ink-secondary">Chargement…</p>
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
        <Link to="/knowledge" className="text-sm text-ink-secondary hover:text-ink">
          ← Base de connaissance
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-ink">{entry.titre}</h2>
          <Badge tone={KNOWLEDGE_CATEGORY_TONES[entry.categorie]}>
            {KNOWLEDGE_CATEGORY_LABELS[entry.categorie]}
          </Badge>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-chrome-dark px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
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
            <span key={tag} className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-ink-secondary">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-chrome-dark bg-surface p-6">
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
