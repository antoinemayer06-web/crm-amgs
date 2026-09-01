-- Remplace health_score par des statuts distincts pour les prospects et
-- les clients, avec une temperature commerciale sur les clients.

alter table public.companies drop constraint health_score_only_for_client;
alter table public.companies drop column health_score;

alter table public.companies
  add column statut_prospect text
    check (statut_prospect in (
      'à_contacter', 'contacté', 'sans_réponse', 'réunion_de_cadrage',
      'devis_à_transmettre', 'devis_transmis', 'en_attente', 'devis_signé'
    )),
  add column statut_livraison text
    check (statut_livraison in ('en_cours', 'échéance', 'facturé', 'payé')),
  add column temperature text
    check (temperature in ('chaud', 'froid'));

alter table public.companies
  add constraint statut_prospect_only_for_prospect
    check (statut_prospect is null or status = 'prospect'),
  add constraint statut_livraison_only_for_client
    check (statut_livraison is null or status = 'client'),
  add constraint temperature_only_for_client
    check (temperature is null or status = 'client');
