# Base de données Lexique Romand

## Installation

1. Ouvrir le Dashboard Supabase du projet.
2. Aller dans **SQL Editor** > **New query**.
3. Copier-coller le contenu de [`schema.sql`](./schema.sql) et exécuter (bouton **Run**).
4. Vérifier dans **Table Editor** que la table `lexiqueromand_terms` est bien créée.
5. Vérifier dans **Authentication > Policies** que les 4 policies RLS sont actives sur `lexiqueromand_terms`.

## Table `lexiqueromand_terms`

| Colonne              | Type          | Détails                                                                 |
|----------------------|---------------|--------------------------------------------------------------------------|
| `id`                 | `uuid`        | Clé primaire, générée automatiquement (`gen_random_uuid()`)             |
| `term`               | `text`        | Le mot ou l'expression romande                                          |
| `category`           | `varchar(16)` | Catégorie (liste fixe gérée côté frontend, `src/lib/categories.js`)      |
| `definition`         | `text`        | Définition du terme                                                     |
| `example`            | `text`        | Exemple d'utilisation (optionnel)                                       |
| `etymology`          | `text`        | Étymologie (optionnel)                                                  |
| `source_identifier`  | `text`        | Identifiant de la source d'où provient le terme                         |
| `source_url`         | `text`        | URL de la source (optionnel)                                            |
| `pronunciation`      | `text`        | Prononciation (optionnel)                                               |
| `variants`           | `text`        | Variantes orthographiques ou régionales (optionnel)                     |
| `present_in_regions` | `text`        | Régions où le terme est utilisé (optionnel)                             |
| `author_id`          | `uuid`        | Référence `auth.users(id)`, non visible/éditable dans le formulaire     |
| `created`            | `timestamptz` | Horodatage de création, non visible/éditable dans le formulaire         |
| `edited`             | `timestamptz` | Horodatage de dernière modification (trigger), non éditable dans le formulaire |

## `lexiqueromand_users` ?

Pas de table dédiée : on utilise directement `auth.users`, la table native de
Supabase Auth. La colonne `author_id` de `lexiqueromand_terms` y fait référence
via une clé étrangère (`references auth.users(id)`).

## Mise à jour automatique de `edited`

La fonction `lexiqueromand_set_edited()` s'exécute en `BEFORE UPDATE` et met
à jour automatiquement la colonne `edited` à `now()` à chaque modification
d'un terme.

## Sécurité (RLS)

Row Level Security est activé avec 4 policies :
- **Lecture** : publique, tout le monde (y compris non connecté) peut consulter le lexique.
- **Insertion / Modification / Suppression** : réservées à l'auteur du terme (`author_id = auth.uid()`), donc à un utilisateur connecté.
