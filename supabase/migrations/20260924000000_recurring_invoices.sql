-- Factures récurrentes rattachées à une entreprise (pas à un projet) :
-- même mécanique que les dépenses/actions marketing (occurrences
-- matérialisées en plusieurs lignes indépendantes dès la création),
-- avec un suivi paiement propre (payee + date_paiement) distinct du
-- modèle de facturation par projet (table documents, inchangé).

create table public.recurring_invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  nom text not null,
  montant numeric not null,
  date_prevue date not null,
  recurrence_frequence text
    check (recurrence_frequence in ('jour', 'semaine', 'mois')),
  recurrence_intervalle integer,
  recurrence_fin date,
  payee boolean not null default false,
  date_paiement date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recurrence_fields_consistent check (
    (recurrence_frequence is null and recurrence_intervalle is null and recurrence_fin is null)
    or (
      recurrence_frequence is not null
      and recurrence_intervalle is not null and recurrence_intervalle > 0
      and recurrence_fin is not null
    )
  )
);

create index recurring_invoices_owner_id_idx on public.recurring_invoices(owner_id);
create index recurring_invoices_company_id_idx on public.recurring_invoices(company_id);

create trigger set_updated_at before update on public.recurring_invoices
  for each row execute function public.set_updated_at();

alter table public.recurring_invoices enable row level security;

create policy "select_own_recurring_invoices" on public.recurring_invoices
  for select using (owner_id = auth.uid());
create policy "insert_own_recurring_invoices" on public.recurring_invoices
  for insert with check (owner_id = auth.uid());
create policy "update_own_recurring_invoices" on public.recurring_invoices
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "delete_own_recurring_invoices" on public.recurring_invoices
  for delete using (owner_id = auth.uid());
