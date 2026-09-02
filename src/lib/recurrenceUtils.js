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

// Une entrée récurrente est matérialisée en plusieurs lignes indépendantes
// dès la création (une par occurrence), plutôt que calculée à la volée —
// chaque occurrence reste ensuite modifiable/supprimable séparément.
// `dateField` est le nom de la colonne date sur laquelle porte la récurrence
// (ex : "date_prevue" pour marketing_actions, "date_depense" pour expenses).
export function buildRecurrenceOccurrences(payload, dateField) {
  const { recurrence_frequence, recurrence_intervalle, recurrence_fin, [dateField]: dateValue, ...rest } = payload

  if (!recurrence_frequence || !dateValue) {
    return [{ ...rest, [dateField]: dateValue, recurrence_frequence: null, recurrence_intervalle: null, recurrence_fin: null }]
  }

  const occurrences = []
  let current = new Date(dateValue)
  const end = new Date(recurrence_fin)

  while (current <= end && occurrences.length < MAX_OCCURRENCES) {
    occurrences.push({
      ...rest,
      [dateField]: toDateString(current),
      recurrence_frequence,
      recurrence_intervalle,
      recurrence_fin,
    })
    current = addInterval(current, recurrence_frequence, recurrence_intervalle)
  }

  return occurrences
}
