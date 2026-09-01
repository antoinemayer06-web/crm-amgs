import { useState } from 'react'
import {
  getDocumentSignedUrl,
  useCreateDocument,
  useDeleteDocument,
  useDocuments,
  useUpdateDocument,
} from '../../hooks/useDocuments'
import { useAuth } from '../../lib/AuthContext'
import { DOCUMENT_STATUS_TONES } from '../../lib/constants'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import DocumentForm from './DocumentForm'

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR')
const formatMontant = (value) =>
  value == null ? '—' : `${Number(value).toLocaleString('fr-FR')} €`

export default function DocumentsTab({ companyId }) {
  const { user } = useAuth()
  const [modalMode, setModalMode] = useState(null) // null | 'create' | document object
  const [openingId, setOpeningId] = useState(null)
  const { data: documents, isLoading, isError, error } = useDocuments(companyId)
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
    await deleteDocument.mutateAsync({ id: document.id, companyId, path: document.url })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Ajouter un document
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {isLoading && <p className="p-6 text-sm text-neutral-500">Chargement…</p>}
        {isError && <p className="p-6 text-sm text-red-600">Erreur : {error.message}</p>}
        {!isLoading && !isError && documents.length === 0 && (
          <p className="p-6 text-sm text-neutral-500">Aucun document pour cette entreprise.</p>
        )}
        {!isLoading && !isError && documents.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOpen(document)}
                      disabled={openingId === document.id}
                      className="font-medium text-neutral-900 hover:underline disabled:opacity-50"
                    >
                      {document.nom}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{document.type}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatMontant(document.montant)}</td>
                  <td className="px-4 py-3">
                    {document.statut ? (
                      <Badge tone={DOCUMENT_STATUS_TONES[document.statut]}>{document.statut}</Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(document.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setModalMode(document)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(document)}
                        className="text-red-500 hover:text-red-700"
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
              await createDocument.mutateAsync({ ...values, companyId, ownerId: user.id })
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
