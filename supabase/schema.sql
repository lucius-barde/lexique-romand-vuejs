-- =========================================================================
-- Lexique Romand — schéma de la base de données
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query
-- =========================================================================

-- -------------------------------------------------------------------------
-- Table lexiqueromand_terms
-- -------------------------------------------------------------------------
-- "lexiqueromand_users" n'existe pas : on référence directement la table
-- native auth.users fournie par Supabase Auth (colonne author_id).

create table if not exists public.lexiqueromand_terms (
  id                  uuid primary key default gen_random_uuid(),
  term                text not null,
  category            varchar(16) not null,
  definition          text not null,
  example             text,
  etymology           text,
  source_identifier   text not null,
  source_url          text,
  pronunciation       text,
  variants            text,
  present_in_regions  text,
  author_id           uuid not null references auth.users (id) on delete cascade,
  created             timestamptz not null default now(),
  edited              timestamptz not null default now()
);

comment on table public.lexiqueromand_terms is 'Termes du Lexique Romand, agrégés depuis plusieurs sources';
comment on column public.lexiqueromand_terms.term is 'Le mot ou l''expression romande';
comment on column public.lexiqueromand_terms.category is 'Catégorie grammaticale/thématique (liste fixe gérée côté frontend)';
comment on column public.lexiqueromand_terms.definition is 'Définition du terme';
comment on column public.lexiqueromand_terms.example is 'Exemple d''utilisation (optionnel)';
comment on column public.lexiqueromand_terms.etymology is 'Étymologie du terme (optionnel)';
comment on column public.lexiqueromand_terms.source_identifier is 'Identifiant de la source d''où provient le terme';
comment on column public.lexiqueromand_terms.source_url is 'URL de la source (optionnel)';
comment on column public.lexiqueromand_terms.pronunciation is 'Prononciation du terme (optionnel)';
comment on column public.lexiqueromand_terms.variants is 'Variantes orthographiques ou régionales (optionnel)';
comment on column public.lexiqueromand_terms.present_in_regions is 'Régions où le terme est utilisé (optionnel)';
comment on column public.lexiqueromand_terms.author_id is 'Référence vers auth.users, non visible/éditable dans le formulaire';
comment on column public.lexiqueromand_terms.created is 'Horodatage de création, non visible/éditable dans le formulaire';
comment on column public.lexiqueromand_terms.edited is 'Horodatage de dernière modification, non visible/éditable dans le formulaire';

-- Index utiles pour les pages /lexique (tri par date, filtre par première lettre)
create index if not exists lexiqueromand_terms_edited_idx
  on public.lexiqueromand_terms (edited desc);

create index if not exists lexiqueromand_terms_term_idx
  on public.lexiqueromand_terms (term);

-- -------------------------------------------------------------------------
-- Trigger : mise à jour automatique de "edited" à chaque modification
-- -------------------------------------------------------------------------

create or replace function public.lexiqueromand_set_edited()
returns trigger
language plpgsql
as $$
begin
  new.edited := now();
  return new;
end;
$$;

drop trigger if exists lexiqueromand_terms_set_edited on public.lexiqueromand_terms;

create trigger lexiqueromand_terms_set_edited
  before update on public.lexiqueromand_terms
  for each row
  execute function public.lexiqueromand_set_edited();

-- -------------------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------------------
-- Le lexique est un contenu public en lecture : tout le monde peut consulter
-- les termes. Seuls les utilisateurs connectés peuvent ajouter/modifier/
-- supprimer, et uniquement leurs propres contributions.

alter table public.lexiqueromand_terms enable row level security;

drop policy if exists "Select all terms" on public.lexiqueromand_terms;
create policy "Select all terms"
  on public.lexiqueromand_terms
  for select
  using (true);

drop policy if exists "Insert own terms" on public.lexiqueromand_terms;
create policy "Insert own terms"
  on public.lexiqueromand_terms
  for insert
  with check (auth.uid() = author_id);

drop policy if exists "Update own terms" on public.lexiqueromand_terms;
create policy "Update own terms"
  on public.lexiqueromand_terms
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Delete own terms" on public.lexiqueromand_terms;
create policy "Delete own terms"
  on public.lexiqueromand_terms
  for delete
  using (auth.uid() = author_id);
