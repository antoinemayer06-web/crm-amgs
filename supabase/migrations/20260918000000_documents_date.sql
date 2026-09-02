-- Date métier du document (date de facturation réelle), distincte de
-- created_at (date d'ajout dans le CRM). Le CA facturé du Dashboard et
-- de la page Finance doit se baser sur cette date, pas sur le moment où
-- le document a été saisi — sinon un document ajouté en retard ne
-- remonte pas dans le bon mois.
alter table public.documents
  add column if not exists date_document date not null default current_date;

-- Pour les documents déjà existants, created_at reste la meilleure
-- approximation disponible de la date réelle.
update public.documents set date_document = created_at::date;
