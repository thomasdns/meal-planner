# Journalisation Vercel

L'application produit des evenements JSON structures. Vercel collecte
automatiquement les sorties du serveur dans ses Runtime Logs. Aucune variable
d'environnement ni aucun compte externe n'est necessaire.

## Consulter les logs

1. Ouvrir le projet dans Vercel.
2. Aller dans **Logs**.
3. Selectionner l'environnement **Production**.
4. Rechercher le nom de l'evenement ou filtrer sur le niveau `error`.

## Evenements importants

```txt
server_request_failed
server_action_failed
smtp_email_failed
smtp_config_incomplete
rate_limit_redis_failed
```

Les champs dont le nom contient `token`, `password`, `secret`, `cookie` ou
`authorization` sont remplaces par `[REDACTED]`. Les emails SMTP sont masques.
Les chemins journalises ne contiennent pas leur chaine de requete afin de ne
pas exposer un lien d'authentification.

## Surveillance recommandee

Lors d'un controle de production, rechercher en priorite :

- `smtp_email_failed` lorsqu'un utilisateur ne recoit pas son email ;
- `server_request_failed` pour une page ou une route en erreur ;
- `server_action_failed` pour une operation utilisateur echouee ;
- `rate_limit_redis_failed` si Upstash devient indisponible.

Une integration externe pourra etre ajoutee plus tard si le volume ou les
besoins d'astreinte le justifient. Elle n'est pas necessaire pour le projet
actuel.

## Conservation

La duree cible des journaux applicatifs et de securite est de 30 jours. Verifier
dans Vercel que la retention effective du plan utilise ne depasse pas cette
duree. Les journaux ne doivent contenir ni contenu de recette, ni email complet,
ni parametre d'URL, ni jeton d'authentification.
