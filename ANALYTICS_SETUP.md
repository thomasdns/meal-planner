# Mise En Place Des Analytics

## Vercel Web Analytics

Le code et le filtrage sont deja integres. Les pages de reinitialisation et de
confirmation email sont exclues. Les parametres d'URL sont retires et les IDs de
recette ou d'utilisateur sont remplaces par des chemins generiques.

Dans Vercel :

1. ouvrir le projet `meal-planner` ;
2. ouvrir **Analytics** puis **Enable Web Analytics** ;
3. redeployer la branche `main` ;
4. visiter quelques pages sans saisir de donnees sensibles dans l'URL ;
5. verifier que les chemins affiches ne contiennent ni email, ni jeton, ni ID ;
6. conserver les evenements personnalises desactives tant qu'ils ne sont pas
   documentes dans la politique de confidentialite.

## Google Analytics 4

Le consentement est integre. Google Analytics reste inactif sans identifiant de
mesure valide et tant que l'utilisateur n'a pas accepte le suivi.
Le choix est stocke sous la forme `analytics-consent=accepted` ou
`analytics-consent=refused`. Une seconde cle technique conserve uniquement sa
date d'expiration afin de redemander le choix apres six mois.

Dans Google Analytics :

1. creer une propriete GA4 et un flux Web pour l'URL de production ;
2. copier l'identifiant au format `G-XXXXXXXXXX` ;
3. regler la conservation des donnees liees aux utilisateurs et evenements sur
   2 mois ;
4. desactiver les fonctions publicitaires, Google Signals et le partage de
   donnees tant qu'un besoin documente ne les justifie pas ;
5. accepter les conditions de traitement et verifier les transferts applicables.

Dans Vercel, seulement apres ces reglages :

1. ajouter `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-EW6E6HMVFC` pour Production
   uniquement afin de ne pas melanger les visites de previsualisation ;
2. redeployer, car une variable `NEXT_PUBLIC_*` est integree au build ;
3. ouvrir le site dans une fenetre privee et cliquer **Tout refuser** ;
4. verifier dans les outils reseau qu'aucune requete vers
   `googletagmanager.com` ou `google-analytics.com` ne part ;
5. rouvrir **Modifier mes preferences cookies**, accepter la mesure d'audience et verifier que
   la visite apparait dans le rapport Temps reel ;
6. retirer ensuite le consentement et verifier que les appels cessent.

Ne jamais placer de nom, email, recette, user ID ou token dans un evenement
Google Analytics.
