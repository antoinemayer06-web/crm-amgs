// Icônes ligne, minimales, en currentColor — évite les emoji décoratifs
// dans la navigation et les listes. Dessinées à la main pour ne pas
// ajouter de dépendance pour une quinzaine de pictos.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, className }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconDashboard({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.2" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.2" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="1.2" />
    </Svg>
  )
}

export function IconFinance({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5c0-1.4 1.1-2.2 2.5-2.2s2.5.8 2.5 2" />
      <path d="M9.5 14.5c0 1.4 1.1 2.2 2.5 2.2s2.5-.8 2.5-2" />
      <path d="M12 7v10" />
    </Svg>
  )
}

export function IconCompanies({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 20V6.5c0-.6.4-1 1-1h6c.6 0 1 .4 1 1V20" />
      <path d="M14 20V10c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v10" />
      <path d="M4 20h16" />
      <path d="M7 9h1M7 12h1M7 15h1M10 9h1M10 12h1M10 15h1" />
    </Svg>
  )
}

export function IconPipeline({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" />
    </Svg>
  )
}

export function IconProjects({ className }) {
  return (
    <Svg className={className}>
      <path d="M3.5 7.5c0-.6.4-1 1-1h4.2l1.6 2h9.2c.6 0 1 .4 1 1V17c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1V7.5Z" />
    </Svg>
  )
}

export function IconMarketing({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 11v2a1 1 0 0 0 1 1h1.5l2 5" />
      <path d="M6.5 11h3l8-5v14l-8-5h-3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
      <path d="M20.5 9.5a3 3 0 0 1 0 5" />
    </Svg>
  )
}

export function IconCalendar({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3M16 3v3" />
      <path d="M7.5 13h1.4M11.3 13h1.4M15.1 13h1.4M7.5 16.3h1.4M11.3 16.3h1.4" />
    </Svg>
  )
}

export function IconKnowledge({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 5.5c1.6-.9 3.6-1 5.5-.3S12 7 12 7v11.5s-1-1.6-2.5-2.3S6 15.4 4 16.3Z" />
      <path d="M20 5.5c-1.6-.9-3.6-1-5.5-.3S12 7 12 7v11.5s1-1.6 2.5-2.3 3.5-.5 5.5.4Z" />
    </Svg>
  )
}

export function IconAssistant({ className }) {
  return (
    <Svg className={className}>
      <rect x="4.5" y="5" width="15" height="11" rx="2.5" />
      <path d="M9 20l1.5-3.2h3L15 20" />
      <path d="M8.5 10.2h.01M12 10.2h.01M15.5 10.2h.01" />
    </Svg>
  )
}

export function IconVision({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M4 16.5l5-4.5 3.5 3 3-2.5L20 16" />
    </Svg>
  )
}

export function IconSettings({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 4.2v2M12 17.8v2M4.2 12h2M17.8 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4" />
    </Svg>
  )
}

export function IconSearch({ className }) {
  return (
    <Svg className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19.5 19.5 15 15" />
    </Svg>
  )
}

export function IconNote({ className }) {
  return (
    <Svg className={className}>
      <path d="M5 4.5h11l3 3V19a.8.8 0 0 1-.8.8H5.8A.8.8 0 0 1 5 19V4.5Z" />
      <path d="M8.5 10h7M8.5 13.5h7M8.5 17h4" />
    </Svg>
  )
}

export function IconDocument({ className }) {
  return (
    <Svg className={className}>
      <path d="M6.5 3.5h7l4 4V20a.8.8 0 0 1-.8.8H6.8A.8.8 0 0 1 6 20V4.3a.8.8 0 0 1 .5-.8Z" />
      <path d="M13.2 3.5V7a1 1 0 0 0 1 1h3.3" />
    </Svg>
  )
}

export function IconPerson({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8.3" r="3.3" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </Svg>
  )
}

export function IconCheck({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.3 2.3 4.7-5.2" />
    </Svg>
  )
}

export function IconMenu({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </Svg>
  )
}

export function IconClose({ className }) {
  return (
    <Svg className={className}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </Svg>
  )
}

export function IconChevronLeft({ className }) {
  return (
    <Svg className={className}>
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </Svg>
  )
}

export function IconChevronRight({ className }) {
  return (
    <Svg className={className}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </Svg>
  )
}

export function IconBell({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 10.5a6 6 0 0 1 12 0v3.8l1.6 2.7H4.4L6 14.3V10.5Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </Svg>
  )
}

export function IconTarget({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" />
    </Svg>
  )
}

export function IconInvoiceClock({ className }) {
  return (
    <Svg className={className}>
      <path d="M6.5 3.5h7l4 4V20a.8.8 0 0 1-.8.8H6.8A.8.8 0 0 1 6 20V4.3a.8.8 0 0 1 .5-.8Z" />
      <circle cx="14.5" cy="15" r="4" />
      <path d="M14.5 13v2l1.4 1" />
    </Svg>
  )
}

export function IconCalendarClock({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3M16 3v3" />
      <circle cx="15.5" cy="15" r="3.2" />
      <path d="M15.5 13.5v1.5l1 0.8" />
    </Svg>
  )
}
