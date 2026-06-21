# Mise En Place Des Analytics

## Google Analytics 4

Le consentement est integre. Google Analytics reste inactif sans identifiant de
mesure valide et tant que l'utilisateur n'a pas accepte le suivi.
Le choix est stocke sous la forme `analytics-consent=accepted` ou
`analytics-consent=refused`. Une seconde cle technique conserve uniquement sa
date d'expiration afin de redemander le choix apres six mois.

Dans Google Analytics :

1. creer une propriete GA4 et un flux Web pour l'URL de production ;
2. copier l'identifiant au format `G-XXXXXXXXXX` ;
3. regler la conservation des donnees liees aux utilisateurs et aux evenements
   sur 2 mois, sans reinitialisation lors d'une nouvelle activite ;
4. dans les mesures ameliorees, conserver les pages vues, les defilements, les
   clics sortants, les telechargements et les interactions avec les formulaires ;
   desactiver la recherche interne automatique afin de ne pas transmettre les
   termes saisis, ainsi que la mesure video tant que le site ne contient pas de
   videos ;
5. desactiver les fonctions publicitaires, Google Signals, la collecte de
   donnees fournies par les utilisateurs et le partage publicitaire ;
6. accepter les conditions de traitement et verifier les transferts applicables.

Dans Vercel, seulement apres ces reglages :

1. ajouter `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-EW6E6HMVFC` pour Production ;
2. redeployer, car une variable `NEXT_PUBLIC_*` est integree au build ;
3. ouvrir le site dans une fenetre privee et cliquer **Tout refuser** ;
4. verifier dans les outils reseau qu'aucune requete vers
   `googletagmanager.com` ou `google-analytics.com` ne part ;
5. rouvrir **Modifier mes preferences cookies**, accepter la mesure d'audience,
   naviguer vers deux pages, puis verifier dans **Rapports > Temps reel** qu'un
   utilisateur et des pages vues apparaissent ; la premiere remontee peut
   demander quelques minutes ;
6. retirer ensuite le consentement et verifier que les appels cessent.

Meal Planner utilise directement la balise Google `gtag.js` avec l'identifiant
`G-...`. Aucun conteneur Google Tag Manager `GTM-...` n'est necessaire. Un
identifiant `GT-...` peut etre affiche par Google comme balise associee : il ne
doit pas remplacer la variable `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.

Le code generalise les routes contenant un identifiant de recette ou
d'utilisateur, retire les parametres d'URL et exclut les pages de confirmation
email et de reinitialisation. Les signaux Google et la personnalisation
publicitaire sont desactives dans la configuration envoyee a GA4.

Ne jamais placer de nom, email, recette, user ID ou token dans un evenement
Google Analytics.
