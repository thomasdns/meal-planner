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
- Sessions revoquees apres changement de mot de passe, d'email ou de role.
- Role utilisateur resynchronise avec la base pendant la validation du JWT.
- Rate limiting applicatif sur :
  - inscription : 5 tentatives par email et par heure ;
  - connexion : 10 tentatives par email toutes les 15 minutes ;
  - reinitialisation du mot de passe : 3 demandes par email et par heure.

## Rate limiting distribue

En production, le rate limiting utilise l'API REST Upstash Redis. Les cles
contenant un email sont hachees avant leur transmission a Redis.

Variables requises :

```txt
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Si Redis est absent ou indisponible, l'application conserve un repli local et
emet `rate_limit_redis_not_configured` ou `rate_limit_redis_failed` dans les
logs. Ce repli est adapte au developpement, mais les variables Upstash doivent
etre configurees sur Vercel.

## Audit dependances

Commande :

```bash
npm run audit
```

Etat actuel :

- 8 vulnerabilites moderees signalees lors de la derniere installation.
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
