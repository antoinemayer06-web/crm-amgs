-- 6ème type d'alerte : bilan de fin de mois (dernier jour du mois, quel
-- que soit le nombre de jours du mois), en complément de l'alerte
-- mi-mois déjà existante (objectif_mi_mois).

do $$
declare r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'notifications'
      and att.attname = 'type'
      and con.contype = 'c'
  loop
    execute format('alter table public.notifications drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.notifications
  add constraint notifications_type_check
    check (type in (
      'action_marketing_du_jour',
      'facture_impayee_7j',
      'objectif_mi_mois',
      'objectif_fin_mois',
      'projet_demarre_ou_termine_bientot',
      'prospect_bloque_devis'
    ));
