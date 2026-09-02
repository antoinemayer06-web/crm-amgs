import { useState } from 'react'
import {
  getDocumentSignedUrl,
  useCreateDocument,
  useDeleteDocument,
  useDocuments,
  useUpdateDocument,
} from '../../hooks/useDocuments'
import { useAuth } from '../../lib/AuthContext'
import { DOCUMENT_STATUS_TONES, formatEnumLabel } from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import DocumentForm from './DocumentForm'

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

// Documents rattachés soit à une company (projectId absent), soit à un
// projet précis (projectId fourni) — même composant, même logique, pour
// éviter de dupliquer l'upload/CRUD/URL signée à deux endroits.
export default function DocumentsSection({ companyId, projectId }) {
  const { user } = useAuth()
  const [modalMode, setModalMode] = useState(null) // null | 'create' | document object
  const [openingId, setOpeningId] = useState(null)
  const { data: documents, isLoading, isError, error } = useDocuments({ companyId, projectId })
  const createDocument = useCreateDocument()
  const updateDocument = useUpdateDocument()
  const deleteDocument = useDeleteDocument()

  async function handleOpen(document) {
    setOpeningId(document.id)
    try {
      const signedUrl = await getDocumentSignedUrl(document.url)
      window.open(signedUrl, '_blank', 'noopener')
    } catch (openError) {
      window.alert(`Impossible d'ouvrir le fichier : ${openError.message}`)
    } finally {
      setOpeningId(null)
    }
  }

  async function handleDelete(document) {
    if (!window.confirm(`Supprimer le document « ${document.nom} » ?`)) return
    await deleteDocument.mutateAsync({ id: document.id, path: document.url })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="btn-primary"
        >
          + Ajouter un document
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-chrome-dark bg-surface">
        {isLoading && <p className="p-6 text-sm text-ink-secondary">Chargement…</p>}
        {isError && <p className="p-6 text-sm font-medium text-red-400">Erreur : {error.message}</p>}
        {!isLoading && !isError && documents.length === 0 && (
          <p className="p-6 text-sm text-ink-secondary">Aucun document pour l'instant.</p>
        )}
        {!isLoading && !isError && documents.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chrome-dark text-xs uppercase text-ink-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-chrome-dark">
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-surface-hover">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOpen(document)}
                      disabled={openingId === document.id}
                      className="font-medium text-ink hover:underline disabled:opacity-50"
                    >
                      {document.nom}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{formatEnumLabel(document.type)}</td>
                  <td className="px-4 py-3 text-ink-secondary">{formatMontant(document.montant)}</td>
                  <td className="px-4 py-3">
                    {document.statut ? (
                      <Badge tone={DOCUMENT_STATUS_TONES[document.statut]}>
                        {formatEnumLabel(document.statut)}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{formatDate(document.date_document)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setModalMode(document)}
                        className="text-ink-secondary hover:text-ink"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(document)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalMode === 'create' && (
        <Modal title="Ajouter un document" onClose={() => setModalMode(null)}>
          <DocumentForm
            requireFile
            submitting={createDocument.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await createDocument.mutateAsync({ ...values, companyId, projectId, ownerId: user.id })
              setModalMode(null)
            }}
          />
        </Modal>
      )}

      {modalMode && modalMode !== 'create' && (
        <Modal title={`Modifier « ${modalMode.nom} »`} onClose={() => setModalMode(null)}>
          <DocumentForm
            initialValues={modalMode}
            submitting={updateDocument.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await updateDocument.mutateAsync({ id: modalMode.id, values })
              setModalMode(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
