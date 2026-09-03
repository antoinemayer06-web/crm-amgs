-- Sépare l'état "facturée" (compte dans le CA facturé) de l'état
-- "payée" (compte dans le CA encaissé) pour les factures récurrentes,
-- comme pour le modèle projet (montant_facture vs montant_encaisse).
-- Avant cette migration, une facture récurrente ne comptait dans le CA
-- facturé qu'une fois payée (payee + date_paiement) : on backfille donc
-- facturee/date_facturation depuis payee/date_paiement pour ne pas
-- perdre le CA facturé déjà enregistré sur les mois passés.

alter table public.recurring_invoices
  add column if not exists facturee boolean not null default false,
  add column if not exists date_facturation date;

update public.recurring_invoices
set facturee = true, date_facturation = date_paiement
where payee = true and facturee = false;
