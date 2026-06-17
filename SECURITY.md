# Securite

Ce document resume les protections actuellement en place et les points a
surveiller avant une exploitation plus large.

## Protections en place

- Authentification par email et mot de passe avec NextAuth.
- Mots de passe haches avec `bcrypt`.
- Validation serveur avec Zod sur les formulaires sensibles.
- Verification d'autorisation dans les Server Actions.
- Isolation des donnees par utilisateur avec `userId`.
- Interface admin protegee par le role `ADMIN` stocke en base de donnees.
- Protection anti-auto-suppression du compte admin courant.
- Headers HTTP de securite configures dans `next.config.ts`.
- Rate limiting applicatif sur :
  - inscription : 5 tentatives par email et par heure ;
  - connexion : 10 tentatives par email toutes les 15 minutes.

## Limite du rate limiting actuel

Le rate limiting actuel utilise une memoire locale du processus Node.js. C'est
utile pour apprendre et limiter les abus simples, mais ce n'est pas suffisant
pour une production a grande echelle avec plusieurs instances.

Evolution recommandee :

- utiliser Redis, Vercel KV, Upstash ou un service equivalent ;
- limiter aussi par adresse IP ;
- journaliser les actions sensibles.

## Audit dependances

Commande :

```bash
npm run audit
```

Etat actuel :

- 7 vulnerabilites moderees signalees.
- Les correctifs proposes par npm utilisent `npm audit fix --force`.
- Ces correctifs forceraient des changements cassants sur des dependances
  structurantes comme Prisma, Next ou NextAuth.

Decision :

- ne pas appliquer `--force` automatiquement ;
- surveiller les mises a jour officielles ;
- appliquer les upgrades manuellement, avec `npm run test`, `npm run lint`,
  `npm run build` et `npm run test:e2e`.

## Bonnes pratiques de production

- Ne jamais commiter `.env` ou `.env.local`.
- Garder `NEXTAUTH_SECRET` et `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` forts et
  differents.
- Limiter le nombre de comptes avec le role `ADMIN`.
- Verifier regulierement les logs de deploiement et les echecs de connexion.
- Tester les parcours critiques apres chaque mise a jour majeure.
