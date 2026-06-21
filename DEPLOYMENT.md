# Deploiement

Ce projet est prevu pour etre deploye sur Vercel avec une base PostgreSQL
hebergee en ligne.

## Objectif

En production, l'application ne doit pas utiliser la base Docker locale. Elle
doit utiliser une base PostgreSQL distante, par exemple Neon ou Supabase.

## Variables d'environnement

Configurer ces variables dans Vercel :

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
CRON_SECRET
LEGAL_PUBLISHER_NAME
LEGAL_PUBLISHER_STATUS
LEGAL_PUBLISHER_ADDRESS
LEGAL_PUBLICATION_DIRECTOR
LEGAL_PRIVACY_EMAIL
LEGAL_HOST_NAME
LEGAL_HOST_ADDRESS
LEGAL_HOST_URL
```

`DATABASE_URL` doit pointer vers la base PostgreSQL en ligne.

`NEXTAUTH_URL` doit etre l'URL publique de l'application, par exemple :

```txt
https://meal-planner.example.com
```

`NEXTAUTH_SECRET` doit etre une valeur aleatoire forte.

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une valeur base64 de 32 octets.

L'acces admin est gere en base de donnees via le champ `User.role`.

Les variables SMTP permettent d'envoyer les emails de verification et de
reinitialisation de mot de passe. Sans nom de domaine personnalise, utiliser un
compte Gmail technique avec un mot de passe d'application Google.

Les variables Upstash activent un rate limiting partage entre toutes les
instances Vercel. Creer une base Redis dans Upstash, puis copier son URL REST et
son token REST dans les variables Production et Preview de Vercel.

Les erreurs structurees sont disponibles dans les Runtime Logs Vercel sans
variable supplementaire. Voir `OBSERVABILITY.md`.

`CRON_SECRET` est une valeur aleatoire longue. Vercel l'envoie automatiquement
dans l'en-tete `Authorization` de la tache definie dans `vercel.json`. Apres le
deploiement, verifier dans **Settings > Crons** que
`/api/cron/cleanup-auth-tokens` est planifiee chaque jour.

Les variables `LEGAL_*` alimentent les pages legales. Elles sont gerees dans
Vercel mais leur valeur est publique une fois la page rendue.

Ne pas ajouter `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` avant d'avoir suivi toutes les
etapes de `ANALYTICS_SETUP.md`. Son ajout exige un redeploiement.

## Commande de build Vercel

Utiliser cette commande de build :

```bash
npm run vercel-build
```

Elle execute :

```bash
prisma generate
next build
```

Pourquoi :

- `prisma generate` regenere le client Prisma pendant le build ;
- `next build` compile l'application Next.js.

Les migrations ne sont volontairement pas executees par Vercel. Elles sont
appliquees separement afin d'eviter plusieurs builds concurrents essayant de
prendre le meme verrou PostgreSQL.

## Avant de deployer

Verifier localement :

```bash
npm run test
npm run lint
npm run build
npx prisma migrate status
```

## Base de donnees

Pour une premiere mise en production :

1. Creer une base PostgreSQL en ligne.
2. Copier l'URL de connexion dans `DATABASE_URL`.
3. Ajouter les variables d'environnement dans Vercel.
4. Configurer le secret GitHub `PRODUCTION_DATABASE_URL`.
5. Lancer le workflow `Production database migrations`.
6. Lancer un premier deploiement Vercel.
7. Verifier que les migrations sont appliquees.

## Creation de la base PostgreSQL en ligne

Vercel Postgres n'est plus disponible pour les nouveaux projets. Pour un
nouveau projet, utiliser une integration PostgreSQL du Marketplace Vercel,
par exemple Neon.

Etapes recommandees :

1. Ouvrir le projet dans Vercel.
2. Aller dans l'onglet Storage ou Marketplace.
3. Ajouter une integration PostgreSQL.
4. Choisir Neon ou un fournisseur PostgreSQL equivalent.
5. Creer une base pour la production.
6. Verifier que `DATABASE_URL` est ajoutee aux variables d'environnement.

Bonne pratique :

- utiliser une base de production pour l'environnement Production ;
- utiliser une base separee pour les environnements Preview si les previews
  appliquent des migrations ;
- ne jamais utiliser la base Docker locale pour la production.

## Migrations de production

Dans GitHub, creer un environnement nomme `production`, puis ajouter le secret
`PRODUCTION_DATABASE_URL`. Sa valeur doit etre la chaine de connexion directe
Neon, sans suffixe `-pooler` dans le nom d'hote.

Pour appliquer les migrations :

1. Ouvrir l'onglet **Actions** du depot GitHub.
2. Choisir **Production database migrations**.
3. Cliquer sur **Run workflow** depuis la branche `main`.
4. Verifier que `Apply migrations` puis `Verify migration status` reussissent.
5. Redeployer ensuite l'application dans Vercel.

Le workflow utilise un groupe de concurrence dedie. Deux executions ne peuvent
donc pas modifier la base de production en meme temps.

## Variables a configurer dans Vercel

Configurer ces variables dans l'environnement Production :

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

`NEXTAUTH_URL` doit correspondre a l'URL publique exacte de l'application.

Exemple :

```txt
https://meal-planner.vercel.app
```

Pour generer des secrets localement :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Generer une valeur differente pour `NEXTAUTH_SECRET` et pour
`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.

Pour donner l'acces admin a un compte, il faut que le compte existe deja en
base, puis lancer la commande de promotion avec la `DATABASE_URL` de
l'environnement cible.

Exemple local :

```bash
npm run admin:promote -- admin@example.com
```

Exemple production depuis PowerShell, en remplacant l'URL par la chaine de
connexion PostgreSQL de production :

```powershell
$env:DATABASE_URL="postgresql://..."
npm run admin:promote -- admin@example.com
Remove-Item Env:\DATABASE_URL
```

## Configuration du build Vercel

Dans Vercel, configurer la commande de build :

```bash
npm run vercel-build
```

Cette commande :

- regenere le client Prisma ;
- compile l'application Next.js.

Les scripts `postinstall` et `prebuild` executent `prisma generate`. Cela evite
un client Prisma obsolete apres une installation, une modification du schema ou
la reutilisation du cache Vercel.

## Attention

Ne jamais commiter :

```txt
.env
.env.local
```

Ces fichiers contiennent des secrets.
