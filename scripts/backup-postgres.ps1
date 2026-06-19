param(
  [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

if (-not $OutputDirectory) {
  $OutputDirectory = Join-Path $projectRoot "backups"
}

$resolvedOutputDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$fileName = "meal-planner-$timestamp.dump"
$containerPath = "/tmp/$fileName"
$hostPath = Join-Path $resolvedOutputDirectory $fileName
$containerBackupCreated = $false

New-Item -ItemType Directory -Force -Path $resolvedOutputDirectory | Out-Null

Push-Location $projectRoot
try {
  docker compose exec -T postgres pg_dump `
    -U meal_planner_user `
    -d meal_planner_db `
    --format=custom `
    --file=$containerPath

  if ($LASTEXITCODE -ne 0) {
    throw "La creation de la sauvegarde PostgreSQL a echoue."
  }

  $containerBackupCreated = $true

  docker cp "meal_planner_postgres:$containerPath" $hostPath

  if ($LASTEXITCODE -ne 0) {
    throw "La copie de la sauvegarde PostgreSQL a echoue."
  }
}
finally {
  if ($containerBackupCreated) {
    docker compose exec -T postgres rm -f $containerPath
  }
  Pop-Location
}

$backup = Get-Item $hostPath
Write-Output "Sauvegarde creee : $($backup.FullName) ($($backup.Length) octets)"
