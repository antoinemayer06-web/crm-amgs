-- documents.url était NOT NULL car un document était toujours pensé
-- comme un fichier importé (facture PDF, devis...). Depuis la fiche
-- projet, saisir "Montant facturé" crée maintenant automatiquement un
-- document de suivi daté (type facture) pour que le CA facturé
-- remonte dans les rapports mensuels — ce document n'a pas de fichier
-- associé, donc url doit pouvoir être vide.
alter table public.documents alter column url drop not null;

-- Rattrapage : les projets qui avaient déjà un montant facturé avant ce
-- correctif n'ont jamais eu leur document créé (l'insertion échouait
-- silencieusement à cause du url NOT NULL ci-dessus). On crée ici le
-- document manquant pour chacun, daté de la dernière modification du
-- projet à défaut d'une date de facturation réelle connue.
insert into public.documents (owner_id, company_id, project_id, nom, type, montant, date_document)
select p.owner_id, p.company_id, p.id, 'Facture — ' || p.nom, 'facture', p.montant_facture,
  coalesce(p.updated_at::date, current_date)
from public.projects p
where p.montant_facture is not null
  and not exists (
    select 1 from public.documents d where d.project_id = p.id and d.type = 'facture'
  );
