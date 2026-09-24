-- =========================================================================
-- Lexique Romand — profils utilisateurs & avis sur les termes
-- À exécuter dans Supabase : Dashboard > SQL Editor > New query
-- (après schema.sql, qui crée déjà public.lexiqueromand_terms)
-- =========================================================================

-- -------------------------------------------------------------------------
-- Table lexiqueromand_profiles
-- -------------------------------------------------------------------------
-- Données complémentaires à auth.users : pseudonyme, région, description,
-- rôle. Une ligne par utilisateur (clé primaire = auth.users.id).

create table if not exists public.lexiqueromand_profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  pseudonyme   text not null,
  region       varchar(16),
  description  text,
  role         varchar(16) not null default 'contributor'
               check (role in ('admin', 'contributor')),
  created      timestamptz not null default now(),
  edited       timestamptz not null default now()
);

comment on table public.lexiqueromand_profiles is 'Données de profil complémentaires à auth.users';
comment on column public.lexiqueromand_profiles.pseudonyme is 'Pseudonyme affiché publiquement (ex : sous les commentaires)';
comment on column public.lexiqueromand_profiles.region is 'Région de l''utilisateur, code court (GE, VD, VS, FR, BE, JU, NE, 74, 73), optionnel';
comment on column public.lexiqueromand_profiles.description is 'Courte description/bio de l''utilisateur, optionnelle';
comment on column public.lexiqueromand_profiles.role is 'Rôle : admin ou contributor. Seul un admin peut modifier ce champ.';

drop trigger if exists lexiqueromand_profiles_set_edited on public.lexiqueromand_profiles;

create trigger lexiqueromand_profiles_set_edited
  before update on public.lexiqueromand_profiles
  for each row
  execute function public.lexiqueromand_set_edited();

-- -------------------------------------------------------------------------
-- Row Level Security — lexiqueromand_profiles
-- -------------------------------------------------------------------------
-- Lecture publique (pseudonyme affiché sous les commentaires).
-- Un utilisateur peut modifier pseudonyme/region/description de son propre
-- profil, mais jamais son propre rôle. Seul un admin peut changer le rôle
-- (le sien ou celui d'un autre).

alter table public.lexiqueromand_profiles enable row level security;

drop policy if exists "Select all profiles" on public.lexiqueromand_profiles;
create policy "Select all profiles"
  on public.lexiqueromand_profiles
  for select
  using (true);

-- Un utilisateur ne peut insérer que son propre profil, et seulement avec
-- le rôle par défaut "contributor" (la création des profils admin se fait
-- via le SQL Editor, pas via l'API).
drop policy if exists "Insert own profile" on public.lexiqueromand_profiles;
create policy "Insert own profile"
  on public.lexiqueromand_profiles
  for insert
  with check (auth.uid() = id and role = 'contributor');

-- Mise à jour de son propre profil : le rôle ne doit pas changer, SAUF si
-- l'utilisateur courant est déjà admin (un admin peut changer n'importe
-- quel rôle, y compris le sien).
drop policy if exists "Update own profile" on public.lexiqueromand_profiles;
create policy "Update own profile"
  on public.lexiqueromand_profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      role = (select p.role from public.lexiqueromand_profiles p where p.id = auth.uid())
      or exists (
        select 1 from public.lexiqueromand_profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );

-- Un admin peut modifier le profil de n'importe quel utilisateur (par
-- exemple pour changer son rôle).
drop policy if exists "Admin update any profile" on public.lexiqueromand_profiles;
create policy "Admin update any profile"
  on public.lexiqueromand_profiles
  for update
  using (
    exists (
      select 1 from public.lexiqueromand_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.lexiqueromand_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- -------------------------------------------------------------------------
-- Table lexiqueromand_reviews
-- -------------------------------------------------------------------------

create table if not exists public.lexiqueromand_reviews (
  id                       uuid primary key default gen_random_uuid(),
  author_id                uuid not null references auth.users (id) on delete cascade,
  term_id                  uuid not null references public.lexiqueromand_terms (id) on delete cascade,
  term_self_usage          integer not null check (term_self_usage between 1 and 5),
  term_perceived_usage     integer not null check (term_perceived_usage between 1 and 5),
  term_written_usage       boolean not null default false,
  term_perceived_context   integer not null check (term_perceived_context between 1 and 5),
  term_regions             varchar(64),
  term_review_message      text,
  created                  timestamptz not null default now(),
  edited                   timestamptz not null default now(),
  constraint lexiqueromand_reviews_author_term_unique unique (author_id, term_id)
);

comment on table public.lexiqueromand_reviews is 'Avis des utilisateurs sur les termes du lexique (1 avis par utilisateur et par terme)';
comment on column public.lexiqueromand_reviews.term_self_usage is 'Utilisez-vous ce terme régulièrement ? 1=Jamais .. 5=Très fréquemment';
comment on column public.lexiqueromand_reviews.term_perceived_usage is 'À quelle fréquence entendez-vous ce terme ? 1=Jamais .. 5=Très fréquemment';
comment on column public.lexiqueromand_reviews.term_written_usage is 'FALSE=Oral uniquement, TRUE=Écrit et oral';
comment on column public.lexiqueromand_reviews.term_perceived_context is '1=Disparu .. 2=Vieillissant .. 3=Informel niche .. 4=Informel commun .. 5=Universel';
comment on column public.lexiqueromand_reviews.term_regions is 'Régions où le terme est utilisé, codes séparés par des virgules (ex: GE,VD,74)';
comment on column public.lexiqueromand_reviews.term_review_message is 'Commentaire libre, affiché publiquement, optionnel';

create index if not exists lexiqueromand_reviews_term_idx
  on public.lexiqueromand_reviews (term_id);

create index if not exists lexiqueromand_reviews_author_idx
  on public.lexiqueromand_reviews (author_id);

drop trigger if exists lexiqueromand_reviews_set_edited on public.lexiqueromand_reviews;

create trigger lexiqueromand_reviews_set_edited
  before update on public.lexiqueromand_reviews
  for each row
  execute function public.lexiqueromand_set_edited();

-- -------------------------------------------------------------------------
-- Row Level Security — lexiqueromand_reviews
-- -------------------------------------------------------------------------
-- Lecture publique (statistiques + commentaires visibles par tous).
-- Seul l'auteur peut créer/modifier/supprimer son propre avis.

alter table public.lexiqueromand_reviews enable row level security;

drop policy if exists "Select all reviews" on public.lexiqueromand_reviews;
create policy "Select all reviews"
  on public.lexiqueromand_reviews
  for select
  using (true);

drop policy if exists "Insert own review" on public.lexiqueromand_reviews;
create policy "Insert own review"
  on public.lexiqueromand_reviews
  for insert
  with check (auth.uid() = author_id);

drop policy if exists "Update own review" on public.lexiqueromand_reviews;
create policy "Update own review"
  on public.lexiqueromand_reviews
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Delete own review" on public.lexiqueromand_reviews;
create policy "Delete own review"
  on public.lexiqueromand_reviews
  for delete
  using (auth.uid() = author_id);

-- =========================================================================
-- Initialisation des profils pour les 3 utilisateurs existants
-- =========================================================================
-- Le pseudonyme est repris depuis auth.users.raw_user_meta_data (display_name
-- ou full_name), sinon depuis la partie locale de l'e-mail.
-- L'utilisateur 3f66d2c6-0f4b-4050-8dbf-6eac25bc736c devient admin, les
-- autres contributor.

insert into public.lexiqueromand_profiles (id, pseudonyme, role)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'display_name',
    u.raw_user_meta_data ->> 'full_name',
    split_part(u.email, '@', 1)
  ) as pseudonyme,
  case
    when u.id = '3f66d2c6-0f4b-4050-8dbf-6eac25bc736c' then 'admin'
    else 'contributor'
  end as role
from auth.users u
on conflict (id) do nothing;
