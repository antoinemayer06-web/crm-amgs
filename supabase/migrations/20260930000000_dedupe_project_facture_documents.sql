-- Corrige "JSON object requested, multiple (or no) rows returned" en
-- éditant la date de facturation d'un projet : rien n'empêchait plusieurs
-- documents type='facture' pour le même projet (useProjectFactureDate/
-- useUpdateProjectMontantFacture utilisaient .maybeSingle(), qui plante
-- si plusieurs lignes correspondent). On garde le document le plus ancien
-- par projet et on supprime les doublons, puis on empêche que ça revienne.

delete from public.documents d
using public.documents dup
where d.project_id is not null
  and d.type = 'facture'
  and dup.project_id = d.project_id
  and dup.type = 'facture'
  and dup.created_at < d.created_at;

create unique index if not exists documents_project_facture_unique
  on public.documents(project_id)
  where type = 'facture' and project_id is not null;
