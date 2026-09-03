import { IconCalendar, IconCheck, IconMarketing, IconProjects } from '../ui/icons'

const SOURCE_ICON = {
  marketing: IconMarketing,
  project_deadline: IconProjects,
  project_step: IconCheck,
  event: IconCalendar,
}

// Intensité graduée (pas de couleur vive) : les événements libres créés
// par l'utilisateur ressortent le plus, les étapes de projet le moins.
const SOURCE_TONE = {
  event: 'text-ink',
  project_deadline: 'text-ink-secondary',
  marketing: 'text-ink-secondary',
  project_step: 'text-ink-tertiary',
}

export default function CalendarItemPill({ item, onClick, showTime }) {
  const Icon = SOURCE_ICON[item.sourceType] ?? IconCalendar
  const tone = SOURCE_TONE[item.sourceType] ?? 'text-ink-secondary'
  const time =
    showTime && item.sourceType === 'event'
      ? new Date(item.raw.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : null

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick(item)
      }}
      className={`flex w-full items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-left text-xs hover:bg-surface-hover ${tone}`}
      title={item.title}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {time && <span className="shrink-0 tabular-nums">{time}</span>}
      <span className="truncate">{item.title}</span>
    </button>
  )
}
