# Sauvegarde Et Restauration PostgreSQL

Ce document decrit la procedure locale et les principes a appliquer en
production. Une sauvegarde n'est consideree comme valide que si sa restauration
a ete testee.

## Sauvegarde locale

Demarrer PostgreSQL puis creer une archive au format personnalise `pg_dump` :

```powershell
npm run db:up
npm run db:backup
```

L'archive est creee dans `backups/`. Ce dossier est ignore par Git car une
sauvegarde peut contenir des donnees personnelles.

## Test de restauration sans risque

Utiliser le chemin affiche par la commande precedente :

```powershell
npm run db:restore:test -- backups/meal-planner-YYYYMMDD-HHMMSS.dump
```

Le script :

1. cree la base temporaire `meal_planner_restore_test` ;
2. restaure l'archive avec `pg_restore --exit-on-error` ;
3. verifie que la table `User` est interrogeable ;
4. supprime la base temporaire et le fichier copie dans le conteneur.

La base de developpement `meal_planner_db` n'est jamais modifiee par ce test.

## Production Neon

1. Activer les sauvegardes et la retention proposees par Neon.
2. Utiliser une chaine de connexion directe, pas le pooler, pour `pg_dump`.
3. Stocker les archives chiffrees hors du poste local et hors du depot Git.
4. Limiter l'acces aux sauvegardes aux personnes autorisees.
5. Tester trimestriellement une restauration dans un projet Neon temporaire.
6. Noter la date, la duree et le resultat de chaque exercice.

Exemple de sauvegarde distante, avec une variable chargee dans le terminal :

```powershell
pg_dump "$env:PRODUCTION_DATABASE_URL" --format=custom --file=meal-planner-production.dump
```

Exemple de restauration dans une base temporaire vide :

```powershell
pg_restore --dbname="$env:RESTORE_TEST_DATABASE_URL" --exit-on-error --no-owner meal-planner-production.dump
```

Ne jamais lancer une restauration directement sur la production sans fenetre
de maintenance, sauvegarde recente et validation explicite.
