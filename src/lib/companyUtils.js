// Changement d'étape prospect : si on arrive sur "devis_signé", conversion
// automatique en client (status + defaults), sinon simple mise à jour de
// l'étape. Centralisé pour rester identique partout où l'étape peut
// changer (page Entreprises, page Pipeline).
export function buildStatutProspectUpdate(newStatutProspect) {
  if (newStatutProspect === 'devis_signé') {
    return {
      status: 'client',
      statut_prospect: null,
      temperature: 'chaud',
      valeur_estimee: null,
      prochaine_action: null,
      date_prochaine_action: null,
    }
  }
  return { statut_prospect: newStatutProspect }
}
