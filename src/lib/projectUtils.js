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
