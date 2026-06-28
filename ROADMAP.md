# Roadmap

Ce document liste les ameliorations futures du planificateur de repas.

## Objectif

Garder une vision claire de ce qui reste a ameliorer sans melanger les idees
produit, les corrections techniques et les sujets de securite.

## Principes de priorisation

- Prioriser ce qui ameliore l'usage quotidien.
- Corriger les risques de securite avant d'ajouter des fonctions secondaires.
- Garder des taches petites, testables et faciles a relire.
- Associer chaque amelioration a un critere d'acceptation.

## Termine

- Mise en production avec Vercel et PostgreSQL en ligne.
- Authentification, verification email et reinitialisation du mot de passe.
- Recuperation d'un compte dont l'email reste non verifie.
- Sessions revoquees apres une modification sensible.
- Interface admin protegee, paginee et separee en deux vues.
- Gestion complete des categories, recettes, ingredients et planning.
- Liste de courses cochable et exportable au format Excel.
- Recherche et filtres de recettes.
- Rate limiting distribue avec Upstash Redis et repli local journalise.
- Tests unitaires, end-to-end, accessibilite et affichage mobile.
- Pipelines GitHub Actions pour la qualite et les migrations de production.
- Documentation de deploiement et de securite.

## Priorite haute

### Exploitation en production

Objectif : rendre les incidents visibles et recuperables.

Criteres d'acceptation :

- Les erreurs SMTP et applicatives importantes declenchent une alerte.
- Une procedure de sauvegarde et de restauration PostgreSQL est documentee et
  testee.
- Les migrations de production sont executees puis verifiees par le workflow
  protege.
- Les dependances et les journaux de production sont controles regulierement.

## Priorite moyenne

### Experience utilisateur

Objectif : rendre l'interface plus agreable et plus fluide.

Criteres d'acceptation :

- Les etats de chargement sont visibles.
- Les messages de succes et d'erreur sont homogenes.
- Les formulaires conservent une experience claire en cas d'erreur.

### Tests d'integration

Objectif : completer les tests navigateur par des tests serveur plus rapides.

Criteres d'acceptation :

- Les Server Actions sensibles sont testees avec leurs autorisations.
- Les erreurs de base de donnees et de service email sont couvertes.
- Les tests ne dependent pas d'un fournisseur SMTP reel.

## Priorite basse

### Donnees nutritionnelles

Objectif : ajouter une dimension sante au planning.

Criteres d'acceptation :

- Les recettes peuvent contenir des informations nutritionnelles.
- Le tableau de bord affiche une synthese simple.
- Les champs restent optionnels pour ne pas alourdir la saisie.

## Dette technique

- Centraliser les messages d'erreur reutilisables.
- Documenter les conventions de nommage du projet.
- Surveiller les evolutions de Next.js, Prisma et NextAuth.

## Definition of Done

Une amelioration est terminee quand :

- le code est lisible et respecte l'architecture existante ;
- les validations serveur sont en place ;
- les tests pertinents sont ajoutes ou mis a jour ;
- `npm run lint`, `npm run test` et `npm run build` passent ;
- la documentation est mise a jour si le comportement change.
