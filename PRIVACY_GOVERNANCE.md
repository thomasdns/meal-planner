# Gouvernance Des Donnees

Derniere revue : 20 juin 2026. Version : 1.0.

Ce document est le registre technique simplifie du projet. Il doit etre relu a
chaque ajout d'une collecte, d'un fournisseur, d'une region ou d'une nouvelle
fonction utilisateur.

## Durees De Conservation

| Donnee | Duree cible | Suppression |
| --- | --- | --- |
| Compte verifie et contenus | Jusqu'a la suppression par l'utilisateur | Suppression immediate de la base active avec cascade relationnelle |
| Sauvegardes chiffrees | 30 jours maximum | Rotation automatique chez le fournisseur et des archives externes |
| Journaux techniques et de securite | 30 jours maximum | Retention configuree dans Vercel |
| Jeton de reinitialisation | 30 minutes | Consommation, remplacement ou purge quotidienne |
| Jeton de verification email | 24 heures | Consommation, remplacement ou purge quotidienne |
| Choix de consentement | 6 mois | Expiration locale ou nouveau choix |
| Google Analytics | 2 mois | Mesure d'audience chargee uniquement apres consentement |

## Sous-traitants

| Fournisseur | Usage | Region connue | Action de controle |
| --- | --- | --- | --- |
| Vercel | Hebergement et logs techniques | Infrastructure internationale | Verifier DPA, retention et garanties de transfert annuellement |
| Neon | PostgreSQL, sauvegardes | Londres pour la production actuelle | Verifier region, retention et DPA apres tout changement d'offre |
| Upstash | Rate limiting distribue | A confirmer dans le tableau de bord | Choisir une region europeenne si disponible et conserver uniquement des cles techniques temporaires |
| Google / Gmail | Emails transactionnels | Infrastructure internationale | Utiliser un compte technique et verifier les garanties contractuelles |
| Google Analytics | Mesure d'audience facultative | Infrastructure internationale | Activer uniquement apres consentement, DPA et reglage de retention minimale |

## Revue Obligatoire

Avant toute nouvelle collecte ou integration :

1. documenter les donnees, la finalite et la base legale ;
2. verifier la region, le DPA et les transferts internationaux ;
3. definir une duree et un mecanisme de suppression ;
4. mettre a jour `/politique-de-confidentialite` et ce registre ;
5. verifier la CSP et le filtrage des journaux ;
6. ajouter un test de refus, d'acceptation ou d'exercice du droit concerne ;
7. incrementer la version et la date communes dans `src/lib/legal.ts`.

## Incidents Et Demandes

Les demandes d'acces, rectification, effacement ou portabilite sont traitees via
l'adresse `LEGAL_PRIVACY_EMAIL`. Ne jamais demander un mot de passe. Verifier
l'identite de maniere proportionnee avant de transmettre des donnees.

En cas d'incident, conserver uniquement les elements necessaires a l'analyse,
revoquer les secrets touches, mesurer les personnes concernees et documenter la
decision de notification aux utilisateurs ou a l'autorite competente.
