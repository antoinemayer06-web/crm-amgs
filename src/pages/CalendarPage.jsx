import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CalendarAgendaView from '../components/calendar/CalendarAgendaView'
import CalendarEventDetailPanel from '../components/calendar/CalendarEventDetailPanel'
import CalendarEventForm from '../components/calendar/CalendarEventForm'
import CalendarMonthView from '../components/calendar/CalendarMonthView'
import Modal from '../components/ui/Modal'
import { SkeletonBlock } from '../components/ui/Skeleton'
import { useCalendarData, useCreateCalendarEvent } from '../hooks/useCalendarEvents'
import { useIsMobile } from '../hooks/useIsMobile'
import { getWeekDays, toLocalDateKey } from '../lib/calendarUtils'

const VIEW_OPTIONS = [
  { key: 'month', label: 'Mois' },
  { key: 'week', label: 'Semaine' },
  { key: 'day', label: 'Jour' },
]

function formatTitle(view, anchor) {
  if (view === 'month') {
    return anchor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }
  if (view === 'day') {
    return anchor.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
  const days = getWeekDays(anchor)
  const start = days[0]
  const end = days[6]
  const sameMonth = start.getMonth() === end.getMonth()
  return sameMonth
    ? `${start.getDate()} – ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
    : `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function shiftAnchor(anchor, view, delta) {
  const next = new Date(anchor)
  if (view === 'month') next.setMonth(next.getMonth() + delta)
  else if (view === 'week') next.setDate(next.getDate() + delta * 7)
  else next.setDate(next.getDate() + delta)
  return next
}

export default function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()
  // La grille mensuelle (7 colonnes) devient illisible sur un téléphone
  // (les titres tronqués à une lettre) — on démarre en vue Jour sur
  // mobile, même logique que Planning/Gantt sur la page Projets.
  const [view, setView] = useState(() => (isMobile ? 'day' : 'month'))
  const [anchor, setAnchor] = useState(() => new Date())
  const [selectedItem, setSelectedItem] = useState(null)
  const [creatingAt, setCreatingAt] = useState(null)

  const { items, isLoading, isError } = useCalendarData()
  const createEvent = useCreateCalendarEvent()

  const itemsByDay = useMemo(() => {
    const map = {}
    for (const item of items) {
      if (!item.date) continue
      const key = toLocalDateKey(item.date)
      if (!map[key]) map[key] = []
      map[key].push(item)
    }
    return map
  }, [items])

  // Ouverture directe depuis une notification (voir notificationTargetUrl
  // -> /calendar?open=<id>) : ne cible que les événements libres, les
  // seuls que le système de notifications relie à un calendar_event.
  useEffect(() => {
    const openId = searchParams.get('open')
    if (!openId || items.length === 0) return
    const match = items.find((item) => item.sourceType === 'event' && item.raw.id === openId)
    if (match) setSelectedItem(match)
    searchParams.delete('open')
    setSearchParams(searchParams, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  function goToday() {
    setAnchor(new Date())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Calendrier</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-chrome-dark p-0.5">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setView(option.key)}
                className={`rounded px-2.5 py-1 text-xs transition-colors duration-150 ${
                  view === option.key ? 'bg-surface-hover text-ink' : 'text-ink-tertiary hover:text-ink-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAnchor((current) => shiftAnchor(current, view, -1))}
            className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
            aria-label="Précédent"
          >
            ←
          </button>
          <span className="min-w-40 text-center text-sm font-medium capitalize text-ink">
            {formatTitle(view, anchor)}
          </span>
          <button
            type="button"
            onClick={() => setAnchor((current) => shiftAnchor(current, view, 1))}
            className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-sm text-ink-secondary hover:bg-surface-hover"
            aria-label="Suivant"
          >
            →
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-md border border-chrome-dark px-2.5 py-1.5 text-xs text-ink-secondary hover:bg-surface-hover"
          >
            Aujourd'hui
          </button>
          <button type="button" onClick={() => setCreatingAt(new Date())} className="btn-primary text-sm">
            + Événement
          </button>
        </div>
      </div>

      {isLoading && <SkeletonBlock className="h-[480px] w-full rounded-lg" />}
      {isError && <p className="text-sm font-medium text-red-400">Erreur de chargement du calendrier.</p>}

      {!isLoading && !isError && (
        <>
          {view === 'month' && (
            <CalendarMonthView
              year={anchor.getFullYear()}
              month={anchor.getMonth()}
              itemsByDay={itemsByDay}
              onSelectItem={setSelectedItem}
              onCreateAtDate={setCreatingAt}
            />
          )}
          {view === 'week' && (
            <CalendarAgendaView
              days={getWeekDays(anchor)}
              itemsByDay={itemsByDay}
              onSelectItem={setSelectedItem}
              onCreateAtDate={setCreatingAt}
            />
          )}
          {view === 'day' && (
            <CalendarAgendaView
              days={[anchor]}
              itemsByDay={itemsByDay}
              onSelectItem={setSelectedItem}
              onCreateAtDate={setCreatingAt}
            />
          )}
        </>
      )}

      {creatingAt && (
        <Modal title="Nouvel événement" onClose={() => setCreatingAt(null)}>
          <CalendarEventForm
            prefillDate={creatingAt}
            submitting={createEvent.isPending}
            onCancel={() => setCreatingAt(null)}
            onSubmit={async (values) => {
              await createEvent.mutateAsync(values)
              setCreatingAt(null)
            }}
          />
        </Modal>
      )}

      {selectedItem && (
        <CalendarEventDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}
