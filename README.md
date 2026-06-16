# Meal Planner

Application web de planification de repas hebdomadaire.

## Objectif

Ce projet a pour but de pratiquer le developpement full stack avec une approche
professionnelle, de l'initialisation du depot jusqu'au deploiement et a la
securisation.

## Fonctionnalites

- Inscription et connexion.
- Gestion des recettes.
- Ingredients modifiables et supprimables.
- Categories modifiables, supprimables et colorees.
- Planning hebdomadaire avec navigation entre semaines.
- Association recette, jour et type de repas.
- Suppression d'un repas planifie.
- Generation automatique de liste de courses.
- Liste de courses cochable, imprimable et exportable en CSV.
- Recherche et filtres de recettes.
- Tableau de bord utilisateur.
- Profil utilisateur avec modification du nom et de l'email.
- Interface admin protegee.

## Stack technique

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth
- Docker
- GitHub Actions
- Playwright
- Vercel

## Demarrage local

Installer les dependances :

```bash
npm install
```

Demarrer PostgreSQL avec Docker :

```bash
docker compose up -d
```

Appliquer les migrations :

```bash
npx prisma migrate deploy
```

Lancer le serveur de developpement :

```bash
npm run dev
```

Ouvrir l'application :

```txt
http://localhost:3000
```

## Variables d'environnement

Copier `.env.example` vers `.env.local`, puis renseigner les valeurs locales.

```bash
cp .env.example .env.local
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env.local
```

Variables principales :

```txt
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ADMIN_EMAILS
```

## Scripts utiles

```bash
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
npm run audit
npm run vercel-build
```

## Qualite

Le projet contient :

- tests unitaires avec Vitest ;
- tests end-to-end avec Playwright ;
- pipeline GitHub Actions ;
- build de production verifie ;
- audit dependances via npm.

La pipeline GitHub Actions lance :

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Securite

Voir [SECURITY.md](./SECURITY.md).

Points principaux :

- validations serveur ;
- controles d'autorisation dans les actions sensibles ;
- headers HTTP de securite ;
- rate limiting sur inscription et connexion ;
- acces admin limite par `ADMIN_EMAILS`.

## Base de donnees

Ouvrir Prisma Studio :

```bash
npx prisma studio
```

Les migrations Prisma sont dans :

```txt
prisma/migrations
```

## Deploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md).

Le deploiement cible utilise :

- Vercel pour l'application ;
- PostgreSQL en ligne, par exemple Neon ;
- variables d'environnement configurees dans Vercel.

## Organisation du projet

```txt
src/
+-- app/
+-- components/
+-- features/
+-- generated/
+-- lib/
+-- types/
```

## Documentation projet

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [SECURITY.md](./SECURITY.md)
- [ROADMAP.md](./ROADMAP.md)

## Statut

Projet en cours d'amelioration continue.

## Auteur

Thomas
