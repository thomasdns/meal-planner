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
- Deconnexion et suppression definitive du compte avec confirmation.
- Interface admin protegee par role en base de donnees.
- Envoi d'emails transactionnels avec suivi structure des erreurs SMTP.

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
```

Notes :

- `DATABASE_URL` pointe vers PostgreSQL.
- `NEXTAUTH_URL` vaut `http://localhost:3000` en local.
- `NEXTAUTH_SECRET` doit etre une valeur secrete robuste.
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une cle base64 de 32 octets.
- `SMTP_HOST`, `SMTP_PORT` et `SMTP_SECURE` configurent le serveur SMTP.
- `SMTP_USER` et `SMTP_PASSWORD` identifient le compte email technique.
- `EMAIL_FROM` est l'expediteur utilise pour les emails transactionnels.
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

- verification obligatoire de l'adresse email ;
- connexion ;
- creation, edition et suppression des categories ;
- creation, edition et suppression des recettes et ingredients ;
- recherche et filtrage des recettes ;
- planification et suppression d'un repas ;
- generation et mise a jour de la liste de courses ;
- consultation, modification et suppression d'un utilisateur par un admin.

Les parcours d'inscription avec envoi SMTP reel, de reinitialisation du mot de
passe, de modification du profil et de suppression du compte restent a ajouter
a la couverture automatisee.

## Surveillance SMTP

Les envois SMTP produisent des evenements JSON consultables dans le terminal en
local et dans les Runtime Logs de Vercel :

```txt
smtp_email_sent
smtp_email_failed
smtp_config_incomplete
```

Les logs contiennent un destinataire masque, l'identifiant du message en cas de
succes et les informations techniques utiles en cas d'echec (`code`, `command`,
`responseCode`). Ils ne contiennent ni mot de passe SMTP, ni contenu d'email,
ni lien d'authentification.

Dans Vercel, ouvrir le projet puis **Logs** et rechercher le nom de l'evenement,
par exemple `smtp_email_failed`.

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
- journalisation SMTP sans secret ni lien d'authentification ;
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

Application deployee sur Vercel et en phase de stabilisation. Les priorites
restantes concernent la robustesse des tests E2E, le rate limiting distribue,
la revocation des sessions et la surveillance de la production.
