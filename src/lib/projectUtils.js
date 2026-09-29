export const DAY = 1000 * 60 * 60 * 24

export function getStepsForProject(allSteps, projectId) {
  return (allSteps ?? [])
    .filter((step) => step.project_id === projectId)
    .sort((a, b) => a.ordre - b.ordre)
}

export function getStepsCount(allSteps, projectId) {
  const steps = getStepsForProject(allSteps, projectId)
  return { done: steps.filter((step) => step.statut === 'fait').length, total: steps.length }
}

// Heures réellement loggées, regroupées par étape (step_id -> total).
export function getActualHoursByStep(workLogs) {
  const map = {}
  for (const log of workLogs ?? []) {
    if (log.duree_heures == null) continue
    map[log.step_id] = (map[log.step_id] ?? 0) + Number(log.duree_heures)
  }
  return map
}

// Heures réellement loggées, regroupées par projet (project_id -> total) —
// utilisé pour le dashboard, en s'appuyant sur getActualHoursByStep sans
// dupliquer la logique d'agrégation existante.
export function getActualHoursByProject(allSteps, workLogs) {
  const hoursByStep = getActualHoursByStep(workLogs)
  const map = {}
  for (const step of allSteps ?? []) {
    const hours = hoursByStep[step.id]
    if (!hours) continue
    map[step.project_id] = (map[step.project_id] ?? 0) + hours
  }
  return map
}

// Récapitulatif projet : temps prévu (somme des estimations d'étapes),
// temps réalisé (somme du journal de travail).
export function getProjectTimeSummary(steps, workLogs) {
  const hasEstimate = steps.some((step) => step.duree_estimee_heures != null)
  const tempsPrevu = hasEstimate
    ? steps.reduce((sum, step) => sum + Number(step.duree_estimee_heures ?? 0), 0)
    : null
  const tempsRealise = (workLogs ?? []).reduce(
    (sum, log) => sum + Number(log.duree_heures ?? 0),
    0,
  )
  return { tempsPrevu, tempsRealise }
}

// Plage temporelle couvrant tous les projets affichés (dates de
// début/échéance + dates de leurs étapes), avec 7 jours de marge de
// chaque côté et la liste des mois à afficher en repère — utilisé par
// la vue Planning (Gantt). Extrait en fonction nommée plutôt que
// recalculé en ligne dans le composant, pour que ce balayage de dates
// soit à un seul endroit si une autre vue en a besoin un jour (au lieu
// d'être recalculé indépendamment).
export function getProjectsTimelineRange(projects, allSteps) {
  const dates = projects
    .flatMap((project) => [
      project.date_debut,
      project.date_livraison_prevue,
      ...getStepsForProject(allSteps, project.id).flatMap((s) => [s.date_debut, s.date_fin]),
    ])
    .filter(Boolean)
    .map((d) => new Date(d))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let start = dates.length ? new Date(Math.min(...dates)) : today
  let end = dates.length ? new Date(Math.max(...dates)) : new Date(today.getTime() + 30 * DAY)

  // Un peu de marge de chaque côté pour la lisibilité.
  start = new Date(start.getTime() - 7 * DAY)
  end = new Date(end.getTime() + 7 * DAY)

  const months = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  while (cursor <= end) {
    months.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return { rangeStart: start, rangeEnd: end, months }
}

// Pastille de santé affichée sur la card Kanban :
// - horloge : pas encore démarré (avant date_debut)
// - vert : en cours et dans les temps, ou payé
// - rouge : échéance dépassée et toujours pas livré
// - orange : livré/à facturer ou facture transmise (en attente de paiement)
export function getProjectHealth(project) {
  if (project.statut === 'payé') return { type: 'dot', color: 'green', label: 'Payé' }
  if (project.statut === 'livré_à_facturer') {
    return { type: 'dot', color: 'orange', label: 'Livré, à facturer' }
  }
  if (project.statut === 'facture_transmise') {
    return { type: 'dot', color: 'orange', label: 'Facture transmise' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (project.date_debut && new Date(project.date_debut) > today) {
    return { type: 'clock', color: 'neutral', label: "Pas encore démarré" }
  }
  if (project.date_livraison_prevue && new Date(project.date_livraison_prevue) < today) {
    return { type: 'dot', color: 'red', label: 'Échéance dépassée' }
  }
  return { type: 'dot', color: 'green', label: 'En cours' }
}
