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
```

`DATABASE_URL` doit pointer vers la base PostgreSQL en ligne.

`NEXTAUTH_URL` doit etre l'URL publique de l'application, par exemple :

```txt
https://meal-planner.example.com
```

`NEXTAUTH_SECRET` doit etre une valeur aleatoire forte.

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` doit etre une valeur base64 de 32 octets.

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

## Attention

Ne jamais commiter :

```txt
.env
.env.local
```

Ces fichiers contiennent des secrets.
