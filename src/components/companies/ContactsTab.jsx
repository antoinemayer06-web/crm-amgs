import { useState } from 'react'
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from '../../hooks/useContacts'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'
import ContactForm from './ContactForm'

export default function ContactsTab({ companyId }) {
  const [modalMode, setModalMode] = useState(null) // null | 'create' | contact object
  const { data: contacts, isLoading, isError, error } = useContacts(companyId)
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const deleteContact = useDeleteContact()

  async function handleDelete(contact) {
    if (!window.confirm(`Supprimer le contact ${contact.first_name} ${contact.last_name} ?`)) {
      return
    }
    await deleteContact.mutateAsync({ id: contact.id, companyId })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalMode('create')}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Ajouter un contact
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {isLoading && <p className="p-6 text-sm text-neutral-500">Chargement…</p>}
        {isError && <p className="p-6 text-sm text-red-600">Erreur : {error.message}</p>}
        {!isLoading && !isError && contacts.length === 0 && (
          <p className="p-6 text-sm text-neutral-500">Aucun contact pour cette entreprise.</p>
        )}
        {!isLoading && !isError && contacts.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Fonction</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      {contact.first_name} {contact.last_name}
                      {contact.is_primary && <Badge tone="blue">Principal</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{contact.role || '—'}</td>
                  <td className="px-4 py-3 text-neutral-600">{contact.email || '—'}</td>
                  <td className="px-4 py-3 text-neutral-600">{contact.phone || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setModalMode(contact)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(contact)}
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
        <Modal title="Ajouter un contact" onClose={() => setModalMode(null)}>
          <ContactForm
            submitting={createContact.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await createContact.mutateAsync({ ...values, company_id: companyId })
              setModalMode(null)
            }}
          />
        </Modal>
      )}

      {modalMode && modalMode !== 'create' && (
        <Modal title="Modifier le contact" onClose={() => setModalMode(null)}>
          <ContactForm
            initialValues={modalMode}
            submitting={updateContact.isPending}
            onCancel={() => setModalMode(null)}
            onSubmit={async (values) => {
              await updateContact.mutateAsync({ id: modalMode.id, values })
              setModalMode(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
