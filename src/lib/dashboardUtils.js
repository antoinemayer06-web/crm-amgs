import { PROJECT_STATUT_LABELS, STATUT_PROSPECT_OPTIONS, formatEnumLabel, isDatePassee } from './constants'
import { getActualHoursByProject } from './projectUtils'

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function isInCurrentMonth(dateStr) {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

// CA du mois en cours : documents de type facture, montant, sur le mois.
export function getCAThisMonth(documents) {
  return documents
    .filter((doc) => doc.type === 'facture' && isInCurrentMonth(doc.created_at))
    .reduce((sum, doc) => sum + Number(doc.montant ?? 0), 0)
}

// Total facturé (tous statuts) vs total encaissé (statut payé), tous
// documents de type facture confondus.
export function getCashSummary(documents) {
  const factures = documents.filter((doc) => doc.type === 'facture')
  const facture = factures.reduce((sum, doc) => sum + Number(doc.montant ?? 0), 0)
  const encaisse = factures
    .filter((doc) => doc.statut === 'payé')
    .reduce((sum, doc) => sum + Number(doc.montant ?? 0), 0)
  return { facture, encaisse, restant: facture - encaisse }
}

// Total des heures réellement travaillées, tous projets confondus
// (somme du journal de travail).
export function getTotalHoursWorked(workLogs) {
  return workLogs.reduce((sum, log) => sum + Number(log.duree_heures ?? 0), 0)
}

// Taux de conversion sur la période (mois en cours) : parmi les
// companies créées ce mois-ci, combien sont (déjà) client. Faute d'un
// historique des transitions de statut_prospect, c'est la meilleure
// approximation disponible avec le schéma actuel.
export function getConversionRate(companies) {
  const createdThisMonth = companies.filter((company) => isInCurrentMonth(company.created_at))
  if (createdThisMonth.length === 0) return null
  const converted = createdThisMonth.filter((company) => company.status === 'client').length
  return (converted / createdThisMonth.length) * 100
}

export function getActiveProjectsCount(projects) {
  return projects.filter((project) => project.statut !== 'payé').length
}

export function getLateProjectsCount(projects) {
  return projects.filter(
    (project) => project.statut !== 'payé' && isDatePassee(project.date_livraison_prevue),
  ).length
}

// Heures prévues (champ projet) vs réelles (agrégées depuis les tâches),
// pour les projets actifs qui ont au moins une des deux valeurs.
export function getHoursComparison(projects, steps, workLogs) {
  const actualByProject = getActualHoursByProject(steps, workLogs)
  return projects
    .filter((project) => project.statut !== 'payé')
    .map((project) => ({
      id: project.id,
      nom: project.nom,
      prevu: project.heures_prevues != null ? Number(project.heures_prevues) : 0,
      reel: actualByProject[project.id] ?? 0,
    }))
    .filter((row) => row.prevu > 0 || row.reel > 0)
}

// Répartition des prospects par étape du pipeline.
export function getPipelineFunnel(companies) {
  const prospects = companies.filter((company) => company.status === 'prospect')
  return STATUT_PROSPECT_OPTIONS.map((statut) => ({
    statut,
    label: formatEnumLabel(statut),
    count: prospects.filter((company) => company.statut_prospect === statut).length,
  }))
}

// Actions urgentes du jour : prospects à relancer, projets proches de
// l'échéance, tâches en retard/du jour — triées par date croissante.
export function getUrgentItems(companies, projects, tasks) {
  const today = startOfToday()
  const in3Days = new Date(today)
  in3Days.setDate(in3Days.getDate() + 3)

  const urgentProspects = companies
    .filter(
      (company) =>
        company.status === 'prospect' &&
        company.date_prochaine_action &&
        new Date(company.date_prochaine_action) <= today,
    )
    .map((company) => ({
      id: `prospect-${company.id}`,
      kind: 'prospect',
      label: company.name,
      sub: company.prochaine_action || 'Action à mener',
      date: company.date_prochaine_action,
      link: `/companies/${company.id}`,
    }))

  const urgentProjects = projects
    .filter(
      (project) =>
        project.statut !== 'payé' &&
        project.date_livraison_prevue &&
        new Date(project.date_livraison_prevue) <= in3Days,
    )
    .map((project) => ({
      id: `project-${project.id}`,
      kind: 'project',
      label: project.nom,
      sub: project.company?.name ? `Échéance — ${project.company.name}` : 'Échéance',
      date: project.date_livraison_prevue,
      link: `/projects?open=${project.id}`,
    }))

  const urgentTasks = tasks
    .filter(
      (task) => task.statut !== 'fait' && task.due_date && new Date(task.due_date) <= today,
    )
    .map((task) => ({
      id: `task-${task.id}`,
      kind: 'task',
      label: task.titre,
      sub: task.company?.name ? `Tâche — ${task.company.name}` : 'Tâche',
      date: task.due_date,
      link: task.company_id ? `/companies/${task.company_id}` : null,
    }))

  return [...urgentProspects, ...urgentProjects, ...urgentTasks].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  )
}

// Flux d'activité récente : combine plusieurs tables sans table
// d'audit dédiée. "Changement de statut" est approximé en comparant
// created_at/updated_at (le schéma ne garde pas l'historique exact).
export function getRecentActivity(notes, documents, projects, companies) {
  const events = []
  const UPDATE_THRESHOLD_MS = 60_000

  for (const note of notes) {
    events.push({
      id: `note-${note.id}`,
      type: 'note',
      timestamp: note.created_at,
      label: `Note ajoutée${note.company?.name ? ` — ${note.company.name}` : ''}`,
      link: note.company_id ? `/companies/${note.company_id}` : null,
    })
  }

  for (const doc of documents) {
    events.push({
      id: `doc-${doc.id}`,
      type: 'document',
      timestamp: doc.created_at,
      label: `Document « ${doc.nom} » ajouté${doc.company?.name ? ` — ${doc.company.name}` : ''}`,
      link: doc.company_id ? `/companies/${doc.company_id}` : null,
    })
  }

  for (const project of projects) {
    events.push({
      id: `project-created-${project.id}`,
      type: 'project',
      timestamp: project.created_at,
      label: `Projet « ${project.nom} » créé${project.company?.name ? ` — ${project.company.name}` : ''}`,
      link: `/projects?open=${project.id}`,
    })
    if (
      project.updated_at &&
      new Date(project.updated_at) - new Date(project.created_at) > UPDATE_THRESHOLD_MS
    ) {
      events.push({
        id: `project-updated-${project.id}`,
        type: 'project',
        timestamp: project.updated_at,
        label: `Projet « ${project.nom} » : statut → ${PROJECT_STATUT_LABELS[project.statut] ?? project.statut}`,
        link: `/projects?open=${project.id}`,
      })
    }
  }

  for (const company of companies) {
    events.push({
      id: `company-created-${company.id}`,
      type: 'company',
      timestamp: company.created_at,
      label: `Entreprise « ${company.name} » créée`,
      link: `/companies/${company.id}`,
    })
    if (
      company.status === 'client' &&
      company.updated_at &&
      new Date(company.updated_at) - new Date(company.created_at) > UPDATE_THRESHOLD_MS
    ) {
      events.push({
        id: `company-converted-${company.id}`,
        type: 'company',
        timestamp: company.updated_at,
        label: `Entreprise « ${company.name} » convertie en client`,
        link: `/companies/${company.id}`,
      })
    }
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
}

// Lundi 00:00 de la semaine en cours.
function startOfWeek() {
  const date = startOfToday()
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diffToMonday)
  return date
}

export function getMarketingWeekCount(marketingActions) {
  const start = startOfWeek()
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return marketingActions.filter((action) => {
    if (action.statut !== 'planifié' || !action.date_prevue) return false
    const date = new Date(action.date_prevue)
    return date >= start && date <= end
  }).length
}

export function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return "à l'instant"
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH}h`
  const diffDays = Math.floor(diffH / 24)
  if (diffDays === 1) return 'hier'
  if (diffDays < 7) return `il y a ${diffDays} j`
  return date.toLocaleDateString('fr-FR')
}
