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
- Interface admin protegee.
- Categories avancees.
- Planning hebdomadaire avance.
- Liste de courses avancee.
- Recherche et filtres de recettes.
- Tests unitaires.
- Tests end-to-end.
- Pipeline GitHub Actions.
- Documentation de deploiement.
- Documentation securite.

## Priorite haute restante

### Mise en production complete

Objectif : deployer l'application avec une base PostgreSQL en ligne.

Criteres d'acceptation :

- Une base PostgreSQL distante est creee.
- Les variables d'environnement sont configurees dans Vercel.
- Les migrations Prisma sont appliquees en production.
- L'inscription et la connexion fonctionnent sur l'URL publique.

Statut : termine.

### Corrections de securite dependances

Objectif : suivre les vulnerabilites signalees par `npm audit`.

Criteres d'acceptation :

- Les alertes sont analysees une par une.
- Aucune mise a jour cassante n'est appliquee sans verification.
- Les tests, le lint et le build passent apres chaque mise a jour.

Statut : en surveillance. Voir `SECURITY.md`.

### Protection contre les abus

Objectif : limiter les tentatives excessives sur les actions sensibles.

Criteres d'acceptation :

- Les formulaires d'authentification sont proteges contre les tentatives trop
  frequentes.
- Les erreurs restent volontairement peu detaillees cote utilisateur.
- Les validations serveur restent obligatoires.

Statut : termine avec Upstash Redis et repli local journalise.

## Priorite moyenne

### Edition et suppression des recettes

Objectif : permettre a un utilisateur de maintenir ses recettes dans le temps.

Criteres d'acceptation :

- Une recette peut etre modifiee par son proprietaire.
- Une recette peut etre supprimee par son proprietaire.
- Les ingredients associes restent coherents.
- Un utilisateur ne peut pas modifier les recettes d'un autre utilisateur.

Statut : termine.

### Amelioration du planning

Objectif : rendre le planning plus pratique au quotidien.

Criteres d'acceptation :

- L'utilisateur peut naviguer entre les semaines.
- L'utilisateur peut retirer une recette d'un repas.
- L'affichage reste lisible sur mobile et desktop.

Statut : termine.

### Liste de courses avancee

Objectif : rendre la liste de courses plus exploitable.

Criteres d'acceptation :

- Les ingredients peuvent etre coches.
- Les ingredients peuvent etre regroupes par categorie.
- La liste peut etre imprimee ou exportee.

Statut : termine.

## Priorite basse

### Recherche et filtres

Objectif : retrouver rapidement une recette.

Criteres d'acceptation :

- Recherche par nom de recette.
- Filtre par categorie.
- Filtre par temps de preparation ou type de repas si ces champs existent.

Statut : termine.

### Experience utilisateur

Objectif : rendre l'interface plus agreable et plus fluide.

Criteres d'acceptation :

- Les etats de chargement sont visibles.
- Les messages de succes et d'erreur sont homogenes.
- Les formulaires conservent une experience claire en cas d'erreur.

### Donnees nutritionnelles

Objectif : ajouter une dimension sante au planning.

Criteres d'acceptation :

- Les recettes peuvent contenir des informations nutritionnelles.
- Le tableau de bord affiche une synthese simple.
- Les champs restent optionnels pour ne pas alourdir la saisie.

## Dette technique

- Ajouter plus de tests d'integration sur les Server Actions.
- Ajouter des tests d'interface sur les parcours critiques.
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
