# Meal Planner

Application web de planification de repas hebdomadaire.

## Objectif

Ce projet permet de pratiquer le developpement full stack avec une approche
professionnelle : architecture, base de donnees, authentification, tests,
securite, Git/GitHub et deploiement.

## Fonctionnalites

- Inscription et connexion par email / mot de passe.
- Verification email automatique apres inscription.
- Renvoi d'un lien de verification pour recuperer un compte non verifie.
- Nouvelle verification et deconnexion apres modification de l'adresse email.
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
- Deconnexion et suppression definitive du compte avec confirmation.
- Interface admin protegee avec des onglets dedies aux utilisateurs et aux statistiques.
- Recherche, filtre et pagination des utilisateurs dans l'administration.
- Statistiques comparatives sur 7, 30 ou 90 jours.
- Envoi d'emails transactionnels avec suivi structure des erreurs SMTP.
- Journalisation JSON dans Vercel et pages d'erreur dediees.
- Sauvegarde PostgreSQL et test de restauration isole.

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
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
EMAIL_FROM
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Notes :

- `DATABASE_URL` pointe vers PostgreSQL.
- `NEXTAUTH_URL` vaut `http://localhost:3000` en local.
- `NEXTAUTH_SECRET` doit etre une valeur secrete robuste.
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une cle base64 de 32 octets.
- `SMTP_HOST`, `SMTP_PORT` et `SMTP_SECURE` configurent le serveur SMTP.
- `SMTP_USER` et `SMTP_PASSWORD` identifient le compte email technique.
- `EMAIL_FROM` est l'expediteur utilise pour les emails transactionnels.
- Les variables `UPSTASH_REDIS_REST_*` activent le rate limiting distribue.
- Elles sont requises sur Vercel. En local, leur absence active un repli en
  memoire et journalise `rate_limit_redis_not_configured`.
- L'acces admin est stocke en base via `User.role`, pas dans les variables d'environnement.

Sans configuration SMTP complete, l'envoi est refuse et une erreur structuree
est journalisee cote serveur. Les liens de verification et de reinitialisation
ne sont jamais ecrits dans les logs.

Pour un projet sans nom de domaine personnalise, Gmail SMTP peut etre utilise
avec une adresse Gmail technique et un mot de passe d'application Google.

## Admin

Les roles utilisateur sont stockes en base :

```txt
USER
ADMIN
```

Pour donner l'acces admin a un utilisateur existant :

```bash
npm run admin:promote -- admin@example.com
```

La commande utilise la base pointee par `DATABASE_URL`.

Prisma Studio reste disponible pour inspecter les donnees :

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
npm run test:e2e:local
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
npm run test:e2e:local
```

`test:e2e:local` demarre PostgreSQL, applique les migrations, construit
l'application puis lance Playwright. `test:e2e` reconstruit l'application sans
demarrer la base. `test:e2e:ci` lance uniquement Playwright sur un build deja
genere et est reserve a la CI.

Le projet utilise Node.js 24, a partir de `24.14.0`. La version de reference
est definie dans `.nvmrc` et `.node-version`. Apres un changement de version
Node, reinstaller les dependances avant de relancer Playwright.

Le test e2e couvre le parcours principal :

- verification obligatoire de l'adresse email ;
- recuperation d'un compte non verifie par renvoi du lien ;
- connexion ;
- modification et reverification d'une adresse email ;
- revocation de session apres reinitialisation du mot de passe ;
- creation, edition et suppression des categories ;
- creation, edition et suppression des recettes et ingredients ;
- recherche et filtrage des recettes ;
- planification et suppression d'un repas ;
- generation et mise a jour de la liste de courses ;
- isolation des recettes entre utilisateurs ;
- suppression definitive de son propre compte ;
- consultation, modification et suppression d'un utilisateur par un admin ;
- revocation de session apres modification administrative d'un compte.

L'envoi SMTP reel reste volontairement hors des tests automatises : Playwright
utilise un transport JSON local qui ne transmet aucun email.

Les tests d'integration Vitest couvrent egalement l'orchestration des Server
Actions d'inscription et de creation de recette, y compris leurs echecs.

## Surveillance SMTP

Les envois SMTP produisent des evenements JSON consultables dans le terminal en
local et dans les Runtime Logs de Vercel :

```txt
smtp_email_sent
smtp_email_failed
smtp_config_incomplete
```

Les logs contiennent un destinataire masque et les informations techniques
utiles en cas d'echec (`code`, `smtp`). Ils ne contiennent ni mot de passe
SMTP, ni contenu d'email, ni lien d'authentification.

Dans Vercel, ouvrir le projet puis **Logs** et rechercher le nom de l'evenement,
par exemple `smtp_email_failed`.

La consultation et la recherche des erreurs Vercel sont detaillees dans
[`OBSERVABILITY.md`](./OBSERVABILITY.md).

## Base De Donnees

Les migrations Prisma sont dans :

```txt
prisma/migrations
```

Verifier l'etat des migrations :

```bash
npx prisma migrate status
```

Les procedures de sauvegarde et de restauration sont documentees dans
[`BACKUP_RESTORE.md`](./BACKUP_RESTORE.md). Commandes locales :

```powershell
npm run db:backup
npm run db:restore:test -- backups/meal-planner-YYYYMMDD-HHMMSS.dump
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
- rate limiting distribue Upstash avec repli local journalise ;
- revocation des sessions apres changement sensible ;
- absence de SQL brut applicatif ;
- journalisation SMTP sans secret ni lien d'authentification ;
- journalisation structuree des erreurs serveur et des Server Actions ;
- `.env` ignore par Git.

## Deploiement

Le deploiement cible utilise :

- Vercel pour l'application ;
- PostgreSQL heberge, par exemple Neon ;
- variables d'environnement configurees dans Vercel ;
- migrations Prisma via le workflow GitHub Actions protege
  `Production database migrations`.

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

Application deployee sur Vercel. Les parcours critiques sont couverts par les
tests E2E, le rate limiting distribue est disponible avec Upstash et les
sessions sont revoquees apres les changements sensibles. Les prochaines
ameliorations sont suivies dans `ROADMAP.md`.
