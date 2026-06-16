# Meal Planner

Application web de planification de repas hebdomadaire.

## Objectif

Ce projet a pour but de pratiquer le developpement full stack avec une approche professionnelle.

Il couvre notamment :

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth
- Git et GitHub
- Deploiement sur Vercel

## Fonctionnalites prevues

- Inscription et connexion
- Gestion des recettes
- Categories de recettes
- Planning hebdomadaire
- Association entre une recette, un jour et un repas
- Generation automatique de liste de courses
- Tableau de bord
- Profil utilisateur

## Stack technique

- Frontend et backend : Next.js
- Langage : TypeScript
- Style : Tailwind CSS
- Base de donnees : PostgreSQL
- ORM : Prisma
- Authentification : NextAuth
- Versioning : Git et GitHub
- Deploiement : Vercel

## Demarrage local

Installer les dependances :

```bash
npm install
```

Lancer le serveur de developpement :

```bash
npm run dev
```

Ouvrir l'application :

```txt
http://localhost:3000
```

## Scripts utiles

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run audit
npm run vercel-build
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

## Base de donnees locale

Demarrer PostgreSQL avec Docker :

```bash
docker compose up -d
```

Appliquer les migrations :

```bash
npx prisma migrate deploy
```

Ouvrir Prisma Studio :

```bash
npx prisma studio
```

## Deploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md).

## Ameliorations futures

Voir [ROADMAP.md](./ROADMAP.md).

## Organisation du projet

```txt
src/
+-- app/
+-- components/
+-- features/
+-- lib/
+-- types/
```

## Statut

Projet en cours de developpement.
