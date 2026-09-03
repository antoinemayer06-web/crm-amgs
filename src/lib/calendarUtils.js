// Clé de jour en heure locale (pas UTC) : un timestamptz proche de
// minuit ne doit pas glisser sur le jour d'à côté pour un fuseau très
// différent d'UTC (ex : La Réunion, UTC+4).
export function toLocalDateKey(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Grille de 6 semaines (42 jours) commençant un lundi, couvrant le mois
// donné avec le padding des mois voisins nécessaire pour compléter la
// grille — approche standard de calendrier mensuel.
export function getMonthGridDays(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7 // lundi = 0
  const gridStart = new Date(year, month, 1 - firstWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

export function getWeekDays(anchorDate) {
  const day = (anchorDate.getDay() + 6) % 7
  const monday = new Date(anchorDate)
  monday.setDate(anchorDate.getDate() - day)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return date
  })
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
