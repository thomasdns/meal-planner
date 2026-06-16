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
ADMIN_EMAILS
```

`DATABASE_URL` doit pointer vers la base PostgreSQL en ligne.

`NEXTAUTH_URL` doit etre l'URL publique de l'application, par exemple :

```txt
https://meal-planner.example.com
```

`NEXTAUTH_SECRET` doit etre une valeur aleatoire forte.

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une valeur base64 de 32 octets.

`ADMIN_EMAILS` contient la liste des emails autorises a acceder a
l'interface admin, separes par des virgules.

Exemple :

```txt
admin@example.com
```

## Commande de build Vercel

Utiliser cette commande de build :

```bash
npm run vercel-build
```

Elle execute :

```bash
prisma generate
prisma migrate deploy
next build
```

Pourquoi :

- `prisma generate` regenere le client Prisma pendant le build ;
- `prisma migrate deploy` applique les migrations existantes ;
- `next build` compile l'application Next.js.

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
4. Lancer un premier deploiement.
5. Verifier que les migrations sont appliquees.

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

## Variables a configurer dans Vercel

Configurer ces variables dans l'environnement Production :

```txt
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ADMIN_EMAILS
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

Pour `ADMIN_EMAILS`, renseigner l'email du compte qui doit acceder a `/admin`.

## Configuration du build Vercel

Dans Vercel, configurer la commande de build :

```bash
npm run vercel-build
```

Cette commande :

- regenere le client Prisma ;
- applique les migrations Prisma existantes ;
- compile l'application Next.js.

Le script `postinstall` execute aussi `prisma generate` apres l'installation
des dependances. Cela evite un client Prisma obsolete lorsque Vercel reutilise
son cache d'installation.

## Attention

Ne jamais commiter :

```txt
.env
.env.local
```

Ces fichiers contiennent des secrets.
