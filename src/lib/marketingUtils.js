const MAX_OCCURRENCES = 52

function addInterval(date, frequence, intervalle) {
  const next = new Date(date)
  if (frequence === 'jour') next.setDate(next.getDate() + intervalle)
  else if (frequence === 'semaine') next.setDate(next.getDate() + intervalle * 7)
  else if (frequence === 'mois') next.setMonth(next.getMonth() + intervalle)
  return next
}

function toDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Une action récurrente est matérialisée en plusieurs lignes indépendantes
// dès la création (une par occurrence), plutôt que calculée à la volée —
// chaque occurrence reste ensuite modifiable/supprimable séparément.
export function buildRecurrenceOccurrences(payload) {
  const { recurrence_frequence, recurrence_intervalle, recurrence_fin, date_prevue, ...rest } = payload

  if (!recurrence_frequence || !date_prevue) {
    return [{ ...rest, date_prevue, recurrence_frequence: null, recurrence_intervalle: null, recurrence_fin: null }]
  }

  const occurrences = []
  let current = new Date(date_prevue)
  const end = new Date(recurrence_fin)

  while (current <= end && occurrences.length < MAX_OCCURRENCES) {
    occurrences.push({
      ...rest,
      date_prevue: toDateString(current),
      recurrence_frequence,
      recurrence_intervalle,
      recurrence_fin,
    })
    current = addInterval(current, recurrence_frequence, recurrence_intervalle)
  }

  return occurrences
}
