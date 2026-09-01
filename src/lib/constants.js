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

export const STATUT_LIVRAISON_OPTIONS = [
  'en_cours_livraison',
  'livré',
  'à_facturer',
  'facture_transmise',
  'payé',
]

export const STATUT_LIVRAISON_TONES = {
  en_cours_livraison: 'blue',
  livré: 'neutral',
  à_facturer: 'amber',
  facture_transmise: 'blue',
  payé: 'green',
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

// Une échéance de livraison est "urgente" si elle est dépassée ou dans
// les 3 prochains jours.
export function isEcheanceUrgente(dateEcheance) {
  if (!dateEcheance) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const echeance = new Date(dateEcheance)
  const diffDays = (echeance - today) / (1000 * 60 * 60 * 24)
  return diffDays <= 3
}
