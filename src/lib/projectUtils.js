export function getStepsForProject(allSteps, projectId) {
  return (allSteps ?? [])
    .filter((step) => step.project_id === projectId)
    .sort((a, b) => a.ordre - b.ordre)
}

export function getStepsCount(allSteps, projectId) {
  const steps = getStepsForProject(allSteps, projectId)
  return { done: steps.filter((step) => step.statut === 'fait').length, total: steps.length }
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
