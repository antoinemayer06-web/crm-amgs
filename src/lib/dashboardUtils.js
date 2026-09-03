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

// -----------------------------------------------------------------
// Page Finance : tout est paramétré par un "monthKey" (ex: "2026-09")
// pour permettre le tri mensuel (mois sélectionné, pas juste le mois en
// cours).
// -----------------------------------------------------------------
function monthKeyOf(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function currentMonthKey() {
  return monthKeyOf(new Date())
}

function isInMonth(dateStr, monthKey) {
  if (!dateStr) return false
  return monthKeyOf(dateStr) === monthKey
}

// CA facturé sur le mois sélectionné (documents de type facture), basé
// sur date_document (date réelle), pas created_at.
export function getCAForMonth(documents, monthKey) {
  return documents
    .filter((doc) => doc.type === 'facture' && isInMonth(doc.date_document, monthKey))
    .reduce((sum, doc) => sum + Number(doc.montant ?? 0), 0)
}

// Factures récurrentes (entreprise, indépendantes des projets) payées
// sur le mois sélectionné — comptent dans le CA facturé uniquement une
// fois marquées payées, sur la base de la date de paiement (pas la date
// prévue, qui peut différer du mois où le paiement est réellement arrivé).
export function getRecurringInvoicesCAForMonth(recurringInvoices, monthKey) {
  return recurringInvoices
    .filter((invoice) => invoice.payee && isInMonth(invoice.date_paiement, monthKey))
    .reduce((sum, invoice) => sum + Number(invoice.montant ?? 0), 0)
}

// Cash réellement encaissé sur le mois sélectionné : somme des
// encaissements enregistrés projet par projet (table cash_collections).
// C'est la seule source qui reflète l'argent réellement reçu avec une
// date précise (contrairement à projects.montant_encaisse, qui est un
// total cumulé sans historique).
export function getEncaisseForMonth(cashCollections, monthKey) {
  return cashCollections
    .filter((collection) => isInMonth(collection.date_encaissement, monthKey))
    .reduce((sum, collection) => sum + Number(collection.montant ?? 0), 0)
}

// Dépenses sur le mois sélectionné (URSSAF, abonnements, marketing, etc.).
export function getExpensesForMonth(expenses, monthKey) {
  return expenses
    .filter((expense) => isInMonth(expense.date_depense, monthKey))
    .reduce((sum, expense) => sum + Number(expense.montant ?? 0), 0)
}

// Répartition en valeur, tous projets confondus : facturé pas encore
// encaissé vs. cash réellement encaissé. Basé sur les champs projet
// (montant_facture / montant_encaisse), qui sont la source que le CRM
// tient réellement à jour — pas sur la table documents, peu utilisée
// en pratique.
export function getFinanceRepartition(projects) {
  const { encaisse, restant } = getCashSummary(projects)
  return [
    { name: 'Facturé non payé', value: Math.max(restant, 0) },
    { name: 'Encaissé', value: encaisse },
  ]
}

// Top clients par CA encaissé sur le mois sélectionné (même logique que
// le CA du mois : compté à la date d'encaissement réel, pas de
// facturation). Le reste est regroupé sous "Autres" pour garder le
// donut lisible.
export function getCAByClientForMonth(cashCollections, monthKey, topN = 5) {
  const totals = new Map()
  for (const collection of cashCollections) {
    if (!isInMonth(collection.date_encaissement, monthKey)) continue
    const name = collection.project?.company?.name ?? 'Sans client'
    totals.set(name, (totals.get(name) ?? 0) + Number(collection.montant ?? 0))
  }

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, topN).map(([name, value]) => ({ name, value }))
  const rest = sorted.slice(topN).reduce((sum, [, value]) => sum + value, 0)
  if (rest > 0) top.push({ name: 'Autres', value: rest })
  return top
}

// Résultat prévu du mois (accrual) : CA facturé du mois moins les
// dépenses du mois.
export function getResultatPrevu(caForMonth, expensesForMonth) {
  return caForMonth - expensesForMonth
}

// Résultat réalisé du mois (cash) : encaissé du mois moins les dépenses
// du mois.
export function getResultatRealise(encaisseForMonth, expensesForMonth) {
  return encaisseForMonth - expensesForMonth
}

// Total facturé vs total encaissé, remontés directement des champs de
// facturation de chaque projet (montant_facture / montant_encaisse),
// tous projets confondus (y compris archivés : l'argent déjà facturé ne
// disparaît pas quand un projet est archivé).
export function getCashSummary(projects) {
  const facture = projects.reduce((sum, project) => sum + Number(project.montant_facture ?? 0), 0)
  const encaisse = projects.reduce((sum, project) => sum + Number(project.montant_encaisse ?? 0), 0)
  return { facture, encaisse, restant: facture - encaisse }
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
  return projects.filter((project) => !project.archived && project.statut !== 'payé').length
}

export function getLateProjectsCount(projects) {
  return projects.filter(
    (project) =>
      !project.archived && project.statut !== 'payé' && isDatePassee(project.date_livraison_prevue),
  ).length
}

// Heures prévues (champ projet) vs réelles (agrégées depuis les tâches),
// pour les projets actifs qui ont au moins une des deux valeurs.
export function getHoursComparison(projects, steps, workLogs) {
  const actualByProject = getActualHoursByProject(steps, workLogs)
  return projects
    .filter((project) => !project.archived && project.statut !== 'payé')
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
        !project.archived &&
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
