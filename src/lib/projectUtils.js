export function getStepsForProject(allSteps, projectId) {
  return (allSteps ?? [])
    .filter((step) => step.project_id === projectId)
    .sort((a, b) => a.ordre - b.ordre)
}

export function getStepsCount(allSteps, projectId) {
  const steps = getStepsForProject(allSteps, projectId)
  return { done: steps.filter((step) => step.statut === 'fait').length, total: steps.length }
}
