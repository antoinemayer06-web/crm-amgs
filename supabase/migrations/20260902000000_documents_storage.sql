-- Bucket de stockage pour les documents liés aux companies (factures,
-- propositions, contrats...). Privé : accès uniquement via URL signée.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Les fichiers sont rangés sous <owner_id>/<company_id>/<fichier> : on
-- restreint l'accès au dossier de l'utilisateur courant.
create policy "select_own_documents_storage"
  on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "insert_own_documents_storage"
  on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "update_own_documents_storage"
  on storage.objects for update
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "delete_own_documents_storage"
  on storage.objects for delete
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
