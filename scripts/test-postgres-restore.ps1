param(
  [Parameter(Mandatory = $true)]
  [string]$BackupPath
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$resolvedBackupPath = (Resolve-Path $BackupPath).Path
$fileName = Split-Path -Leaf $resolvedBackupPath
$containerPath = "/tmp/$fileName"
$testDatabase = "meal_planner_restore_test"
$containerBackupCopied = $false
$testDatabaseCreated = $false

Push-Location $projectRoot
try {
  docker cp $resolvedBackupPath "meal_planner_postgres:$containerPath"

  if ($LASTEXITCODE -ne 0) {
    throw "La copie de la sauvegarde vers PostgreSQL a echoue."
  }

  $containerBackupCopied = $true

  docker compose exec -T postgres dropdb `
    -U meal_planner_user `
    --if-exists `
    $testDatabase
  docker compose exec -T postgres createdb `
    -U meal_planner_user `
    $testDatabase

  if ($LASTEXITCODE -ne 0) {
    throw "La creation de la base temporaire a echoue."
  }

  $testDatabaseCreated = $true
  docker compose exec -T postgres pg_restore `
    -U meal_planner_user `
    -d $testDatabase `
    --exit-on-error `
    --no-owner `
    $containerPath

  if ($LASTEXITCODE -ne 0) {
    throw "La restauration PostgreSQL a echoue."
  }

  docker compose exec -T postgres psql `
    -U meal_planner_user `
    -d $testDatabase `
    -v ON_ERROR_STOP=1 `
    -c 'SELECT COUNT(*) AS users_restored FROM "User";'

  if ($LASTEXITCODE -ne 0) {
    throw "La verification de la base restauree a echoue."
  }

  Write-Output "Restauration testee avec succes dans la base temporaire $testDatabase."
}
finally {
  if ($testDatabaseCreated) {
    docker compose exec -T postgres dropdb `
      -U meal_planner_user `
      --if-exists `
      $testDatabase
  }

  if ($containerBackupCopied) {
    docker compose exec -T postgres rm -f $containerPath
  }

  Pop-Location
}
