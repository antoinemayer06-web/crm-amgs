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
