# Lexique Romand

Lexique collaboratif de termes suisses romands, agrégeant des données de
plusieurs sources.

- **Frontend** : Vue 3 + Vite
- **Style** : Tailwind CSS (v4, responsive mobile)
- **Backend** : Supabase (PostgreSQL + Auth email/password)
- **Déploiement** : Vercel

## Fonctionnalités

- `/` — Page d'accueil publique.
- `/lexique` — Lexique complet, trié par date de modification décroissante, paginé (50 termes/page).
- `/lexique/page/:page` — Pagination du lexique complet.
- `/lexique/:letter` — Termes commençant par une lettre donnée, par ordre alphabétique.
- `/lexique/:letter/page/:page` — Pagination du lexique filtré par lettre.
- `/term` — Ajouter un nouveau terme (connexion requise).
- `/term/:id/edit` — Éditer un terme existant (connexion requise, propriétaire uniquement).
- `/user/login` — Connexion (email + mot de passe, Supabase Auth).
- `/user/logout` — Déconnexion, puis redirection vers l'accueil.
- `/import` — Import de termes depuis Henrysuter.ch et Topio.ch, connexion requise.

## Développement local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner les clés Supabase (voir section [Variables d'environnement](#variables-denvironnement) ci-dessous) :

```bash
cp .env.example .env.local
```

### 3. Créer le schéma de base de données

Suivre les instructions de [`supabase/README.md`](./supabase/README.md) pour créer la table `lexiqueromand_terms` et activer les policies RLS dans le Dashboard Supabase.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

> Les recherches externes passent par la fonction serverless `api/import.js` afin d'éviter les restrictions CORS du navigateur. En local, le proxy Vite relaie `/api` vers `http://localhost:3000`; utilisez un environnement Vercel local (par exemple `vercel dev`) pour tester simultanément le frontend et la fonction serverless.

### 5. Build de production (vérification locale)

```bash
npm run build
npm run preview
```

## Variables d'environnement

| Variable | Description | Où la trouver |
|---|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Dashboard Supabase → **Project Settings** → **API** → *Project URL* |
| `VITE_SUPABASE_ANON_KEY` | Clé publique (anon/public) | Dashboard Supabase → **Project Settings** → **API** → *Project API keys* → `anon` `public` |

⚠️ Ces variables sont préfixées `VITE_` car elles doivent être exposées au code
frontend (elles sont injectées au build par Vite). Il s'agit de la clé
publique `anon`, protégée par les policies RLS côté base — ne jamais utiliser
la clé `service_role` dans ce projet frontend.

- En local : renseigner ces valeurs dans `.env.local` (fichier ignoré par Git, jamais commité).
- Sur Vercel : à définir dans **Project Settings → Environment Variables** (voir ci-dessous).

## Déploiement sur Vercel

### Option A — via l'interface Vercel

1. Pousser le projet sur GitHub (voir [Git / GitHub](#git--github) ci-dessous).
2. Sur [vercel.com](https://vercel.com), cliquer **Add New → Project** et importer le dépôt GitHub.
3. Vercel détecte automatiquement Vite. Les valeurs par défaut suivantes doivent être correctes :
   - **Framework Preset** : `Vite`
   - **Build Command** : `npm run build` (ou `vite build`)
   - **Output Directory** : `dist`
4. Dans **Environment Variables**, ajouter :
   - `VITE_SUPABASE_URL` = *(URL du projet Supabase)*
   - `VITE_SUPABASE_ANON_KEY` = *(clé anon/public Supabase)*
5. Cliquer **Deploy**.

### Option B — via la CLI Vercel

```bash
npm install -g vercel
vercel        # première configuration du projet
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

### Routage SPA

Le fichier [`vercel.json`](./vercel.json) contient une règle de *rewrite*
catch-all (`/(.*) → /index.html`) nécessaire car l'application utilise
`vue-router` en mode `history`. Sans cette règle, rafraîchir une page comme
`/lexique` en production renverrait une 404.

### Configuration Supabase après déploiement

Dans le Dashboard Supabase → **Authentication → URL Configuration**, ajouter
l'URL de production Vercel (ex. `https://lexique-romand.vercel.app`) dans
**Site URL** et/ou **Redirect URLs**, afin que l'authentification fonctionne
correctement une fois déployée.

## Git / GitHub

Le fichier [`.gitignore`](./.gitignore) exclut déjà `node_modules`, `dist`,
`.env*` et `.vercel`. Aucune clé ni secret ne doit être commité : seul
`.env.example` (avec des placeholders) doit être versionné.

## Structure du projet

```
src/
  components/    Composants réutilisables (formulaire de terme, navbar, pagination,
                 navigation alphabétique, formulaire de connexion, dialogue de confirmation)
  lib/            Logique métier (Supabase client, auth, accès aux termes, catégories)
  pages/          Pages routées (Home, Lexique, TermEdit, Login, Logout, Import)
  router/         Configuration vue-router
supabase/
  schema.sql      Script SQL à exécuter dans Supabase (table, trigger, RLS)
  README.md       Détails du schéma de base de données
```
