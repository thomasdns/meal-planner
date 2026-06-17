# Meal Planner

Application web de planification de repas hebdomadaire.

## Objectif

Ce projet permet de pratiquer le developpement full stack avec une approche
professionnelle : architecture, base de donnees, authentification, tests,
securite, Git/GitHub et deploiement.

## Fonctionnalites

- Inscription et connexion par email / mot de passe.
- Verification email automatique apres inscription.
- Reinitialisation du mot de passe par lien securise.
- Gestion des recettes.
- Gestion des ingredients.
- Categories de recettes colorees.
- Recherche et filtres de recettes.
- Planning hebdomadaire.
- Association recette, jour et type de repas.
- Suppression d'un repas planifie.
- Generation automatique de liste de courses.
- Liste de courses cochable, imprimable et exportable en CSV.
- Tableau de bord utilisateur.
- Profil utilisateur avec modification du nom et de l'email.
- Interface admin protegee par role en base de donnees.

## Stack technique

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth
- Docker
- Vitest
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

Generer le client Prisma si necessaire :

```bash
npx prisma generate
```

Lancer le serveur de developpement :

```bash
npm run dev
```

Ouvrir l'application :

```txt
http://localhost:3000
```

## Variables D'environnement

Copier `.env.example` vers `.env`, puis renseigner les valeurs locales.

```powershell
Copy-Item .env.example .env
```

Variables attendues :

```txt
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
RESEND_API_KEY
EMAIL_FROM
```

Notes :

- `DATABASE_URL` pointe vers PostgreSQL.
- `NEXTAUTH_URL` vaut `http://localhost:3000` en local.
- `NEXTAUTH_SECRET` doit etre une valeur secrete robuste.
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une cle base64 de 32 octets.
- `RESEND_API_KEY` permet l'envoi des emails transactionnels.
- `EMAIL_FROM` est l'expediteur utilise pour les emails.
- L'acces admin est stocke en base via `User.role`, pas dans les variables d'environnement.

Sans `RESEND_API_KEY` et `EMAIL_FROM`, les liens de verification email et de
reinitialisation de mot de passe sont seulement journalises cote serveur. Aucun
vrai email ne peut etre envoye sans provider email.

## Admin

Les roles utilisateur sont stockes en base :

```txt
USER
ADMIN
```

Pour donner l'acces admin a un utilisateur local, mettre son champ `role` a
`ADMIN` via Prisma Studio ou une requete SQL.

Ouvrir Prisma Studio :

```bash
npx prisma studio
```

## Scripts Utiles

```bash
npm run dev
npm run lint
npm test
npm run test:e2e
npm run build
npm run audit
npm run vercel-build
```

## Tests

Tests unitaires :

```bash
npm test
```

Tests end-to-end :

```bash
npx playwright install chromium
npm run test:e2e
```

Le test e2e couvre le parcours principal :

- inscription ;
- connexion ;
- creation de categorie ;
- creation de recette ;
- ajout d'ingredient ;
- planification d'un repas ;
- generation de liste de courses ;
- modification du profil.
- deconnexion ;
- suppression du compte.

## Base De Donnees

Les migrations Prisma sont dans :

```txt
prisma/migrations
```

Verifier l'etat des migrations :

```bash
npx prisma migrate status
```

## Qualite Et Securite

Controles recommandes avant commit :

```bash
npm run lint
npm run build
npm test
npm run test:e2e
npm run audit
```

Points de securite deja en place :

- validation serveur avec Zod ;
- hash des mots de passe avec bcrypt ;
- protection des pages privees par session ;
- controles d'autorisation cote serveur ;
- role admin en base de donnees ;
- rate limiting sur inscription et connexion ;
- absence de SQL brut applicatif ;
- `.env` ignore par Git.

## Deploiement

Le deploiement cible utilise :

- Vercel pour l'application ;
- PostgreSQL heberge, par exemple Neon ;
- variables d'environnement configurees dans Vercel ;
- migrations Prisma via `npm run vercel-build`.

## Organisation Du Projet

```txt
src/
+-- app/
+-- components/
+-- features/
+-- generated/
+-- lib/
+-- types/
```

## Statut

Projet en phase de stabilisation avant deploiement.
