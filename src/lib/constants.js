export const COMPANY_STATUS_OPTIONS = ['prospect', 'client']

export const COMPANY_STATUS_TONES = {
  prospect: 'blue',
  client: 'green',
}

export const COMPANY_SOURCES = [
  'linkedin',
  'email',
  'bouche_à_oreille',
  'campagne_publicitaire',
  'appel',
]

export const STATUT_PROSPECT_OPTIONS = [
  'à_contacter',
  'contacté',
  'sans_réponse',
  'refus',
  'en_discussion',
  'devis_à_transmettre',
  'devis_transmis',
  'devis_signé',
]

export const STATUT_PROSPECT_TONES = {
  à_contacter: 'neutral',
  contacté: 'blue',
  sans_réponse: 'amber',
  refus: 'red',
  en_discussion: 'blue',
  devis_à_transmettre: 'amber',
  devis_transmis: 'blue',
  devis_signé: 'green',
}

export const TEMPERATURE_OPTIONS = ['chaud', 'froid']

export const TEMPERATURE_TONES = {
  chaud: 'red',
  froid: 'blue',
}

export const NOTE_TYPES = ['appel', 'email', 'réunion', 'générale']

export const DOCUMENT_TYPES = [
  'facture',
  'bon_de_livraison',
  'proposition',
  'contrat',
  'autre',
]

export const DOCUMENT_STATUSES = ['brouillon', 'envoyé', 'payé', 'en_retard']

export const DOCUMENT_STATUS_TONES = {
  brouillon: 'neutral',
  envoyé: 'blue',
  payé: 'green',
  en_retard: 'red',
}

// Affichage propre d'une valeur d'enum stockée avec des underscores
// (ex: "à_contacter" -> "À contacter", "bouche_à_oreille" -> "Bouche à oreille").
export function formatEnumLabel(value) {
  if (!value) return ''
  const [first, ...rest] = value.split('_')
  const capitalized = first.charAt(0).toUpperCase() + first.slice(1)
  return rest.length ? `${capitalized} ${rest.join(' ')}` : capitalized
}

export const PROJECT_STATUT_OPTIONS = [
  'en_cours_livraison',
  'livré_à_facturer',
  'facture_transmise',
  'payé',
]

export const PROJECT_STATUT_TONES = {
  en_cours_livraison: 'blue',
  livré_à_facturer: 'amber',
  facture_transmise: 'blue',
  payé: 'green',
}

export const PROJECT_STATUT_LABELS = {
  en_cours_livraison: 'En cours',
  livré_à_facturer: 'Livré / à facturer',
  facture_transmise: 'Facture transmise',
  payé: 'Payé',
}

// Une échéance est "urgente" si elle est dépassée ou dans les 3 jours.
export function isDateUrgente(date) {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  const diffDays = (target - today) / (1000 * 60 * 60 * 24)
  return diffDays <= 3
}

export function isDatePassee(date) {
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(date) < today
}

export function getInitials(name) {
  if (!name) return '?'
  const words = name.trim().split(/\s+/).slice(0, 2)
  return words.map((word) => word.charAt(0).toUpperCase()).join('')
}

// Couleur d'avatar stable dérivée du nom (même entreprise = même couleur).
const AVATAR_PALETTE = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-lime-600',
]

export function getAvatarColor(name) {
  if (!name) return AVATAR_PALETTE[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}
