import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteCalendarEvent, useUpdateCalendarEvent } from '../../hooks/useCalendarEvents'
import Modal from '../ui/Modal'
import SidePanel from '../ui/SidePanel'
import CalendarEventForm from './CalendarEventForm'

const SOURCE_LABELS = {
  marketing: 'Action marketing',
  project_deadline: 'Échéance de projet',
  project_step: 'Étape de projet',
  event: 'Événement',
}

function formatDateTime(value, hasTime) {
  const date = new Date(value)
  return hasTime
    ? date.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
    : date.toLocaleDateString('fr-FR', { dateStyle: 'long' })
}

export default function CalendarEventDetailPanel({ item, onClose }) {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const updateEvent = useUpdateCalendarEvent()
  const deleteEvent = useDeleteCalendarEvent()

  const isFreeEvent = item.sourceType === 'event'

  function handleNavigateToSource() {
    if (item.linkTo) navigate(item.linkTo)
    onClose()
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer l'événement « ${item.title} » ?`)) return
    await deleteEvent.mutateAsync(item.raw.id)
    onClose()
  }

  return (
    <SidePanel title={item.title} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-tertiary">
          {SOURCE_LABELS[item.sourceType]}
        </p>

        <div className="space-y-1">
          <p className="text-xs font-medium text-ink-secondary">Date</p>
          <p className="text-sm text-ink">
            {formatDateTime(item.raw.date_debut ?? item.date, isFreeEvent)}
            {isFreeEvent && item.raw.date_fin && ` → ${formatDateTime(item.raw.date_fin, true)}`}
          </p>
        </div>

        {isFreeEvent && item.raw.description && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-secondary">Description</p>
            <p className="text-selectable whitespace-pre-wrap text-sm text-ink-secondary">
              {item.raw.description}
            </p>
          </div>
        )}

        {isFreeEvent && item.raw.lieu && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-secondary">Lieu</p>
            <p className="text-sm text-ink-secondary">{item.raw.lieu}</p>
          </div>
        )}

        {item.subtitle && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-secondary">Entreprise</p>
            {item.raw.company?.id ? (
              <Link
                to={`/companies/${item.raw.company.id}`}
                onClick={onClose}
                className="text-sm text-ink hover:underline"
              >
                {item.subtitle}
              </Link>
            ) : (
              <p className="text-sm text-ink-secondary">{item.subtitle}</p>
            )}
          </div>
        )}

        {isFreeEvent && item.raw.alerte_avant_minutes && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-secondary">Rappel</p>
            <p className="text-sm text-ink-secondary">
              {item.raw.alerte_avant_minutes >= 1440
                ? `${item.raw.alerte_avant_minutes / 1440} jour(s) avant`
                : `${item.raw.alerte_avant_minutes} minutes avant`}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-chrome-dark pt-4">
          {isFreeEvent ? (
            <>
              <button type="button" onClick={() => setEditing(true)} className="btn-secondary text-sm">
                Modifier
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-400"
              >
                Supprimer
              </button>
            </>
          ) : (
            item.linkTo && (
              <button type="button" onClick={handleNavigateToSource} className="btn-secondary text-sm">
                Voir {item.sourceType === 'marketing' ? "l'action" : 'le projet'}
              </button>
            )
          )}
        </div>
      </div>

      {editing && (
        <Modal title="Modifier l'événement" onClose={() => setEditing(false)}>
          <CalendarEventForm
            initialValues={item.raw}
            submitting={updateEvent.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={async (values) => {
              await updateEvent.mutateAsync({ id: item.raw.id, values })
              setEditing(false)
              onClose()
            }}
          />
        </Modal>
      )}
    </SidePanel>
  )
}
