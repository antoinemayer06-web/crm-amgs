import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KnowledgeFilters from '../components/knowledge/KnowledgeFilters'
import KnowledgeForm from '../components/knowledge/KnowledgeForm'
import KnowledgeList from '../components/knowledge/KnowledgeList'
import Modal from '../components/ui/Modal'
import { useCreateKnowledgeEntry, useKnowledgeEntries } from '../hooks/useKnowledgeBase'

export default function KnowledgeBasePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('')
  const [creating, setCreating] = useState(false)

  const { data: entries, isLoading, isError, error } = useKnowledgeEntries({ search, categorie })
  const createEntry = useCreateKnowledgeEntry()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ink">Base de connaissance</h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="btn-primary"
        >
          Nouvelle fiche
        </button>
      </div>

      <KnowledgeFilters
        search={search}
        onSearchChange={setSearch}
        categorie={categorie}
        onCategorieChange={setCategorie}
      />

      {isLoading && <p className="text-sm text-ink-secondary">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Erreur : {error.message}</p>}

      {!isLoading && !isError && (
        <KnowledgeList
          entries={entries ?? []}
          categoryFilter={categorie}
          onEntryClick={(entry) => navigate(`/knowledge/${entry.id}`)}
        />
      )}

      {creating && (
        <Modal title="Nouvelle fiche" size="lg" onClose={() => setCreating(false)}>
          <KnowledgeForm
            defaultCategorie={categorie || undefined}
            submitting={createEntry.isPending}
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              const entry = await createEntry.mutateAsync(values)
              setCreating(false)
              navigate(`/knowledge/${entry.id}`)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
