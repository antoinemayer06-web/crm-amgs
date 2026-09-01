// Statuts sélectionnables à la création/édition (« perdu » n'est plus géré
// comme un statut : un prospect perdu est supprimé de la base).
export const COMPANY_STATUS_OPTIONS = ['prospect', 'client', 'dormant']

export const COMPANY_STATUS_TONES = {
  prospect: 'blue',
  client: 'green',
  perdu: 'red',
  dormant: 'amber',
}

export const COMPANY_SOURCES = [
  'linkedin',
  'référence',
  'site web',
  'salon',
  'autre',
]

export const STATUT_PROSPECT_OPTIONS = [
  'à_contacter',
  'contacté',
  'sans_réponse',
  'réunion_de_cadrage',
  'devis_à_transmettre',
  'devis_transmis',
  'en_attente',
  'devis_signé',
]

export const STATUT_PROSPECT_TONES = {
  à_contacter: 'neutral',
  contacté: 'blue',
  sans_réponse: 'amber',
  réunion_de_cadrage: 'blue',
  devis_à_transmettre: 'amber',
  devis_transmis: 'blue',
  en_attente: 'neutral',
  devis_signé: 'green',
}

export const STATUT_LIVRAISON_OPTIONS = ['en_cours', 'échéance', 'facturé', 'payé']

export const STATUT_LIVRAISON_TONES = {
  en_cours: 'blue',
  échéance: 'amber',
  facturé: 'neutral',
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
