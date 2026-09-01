-- Le statut de facturation/livraison, retiré de companies, se pilote
-- désormais par projet (page Projets / Livraison).

update public.projects
  set statut = case statut
    when 'livré' then 'livré'
    else 'en_cours_livraison'
  end;

do $$
declare r record;
begin
  for r in
    select distinct con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'projects'
      and att.attname = 'statut'
      and con.contype = 'c'
  loop
    execute format('alter table public.projects drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.projects
  alter column statut set default 'en_cours_livraison';

alter table public.projects
  add constraint projects_statut_check
    check (statut in ('en_cours_livraison', 'livré', 'à_facturer', 'facture_transmise', 'payé'));

create index if not exists projects_statut_idx on public.projects(statut);
create index if not exists projects_date_livraison_prevue_idx on public.projects(date_livraison_prevue);
