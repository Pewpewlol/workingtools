# ==============================================
# Git Commit Report (aktueller Monat, Branch develop oder main)
# ==============================================

param(
    [string]$BaseDir = "$PWD",                             # Startverzeichnis
    [string]$OutputFile = "$HOME\monthly_commits.txt"      # Ziel-Datei
)

# Autor aus Git-Konfiguration
$author = git config user.name

# Erster Tag des aktuellen Monats
$startOfMonth = (Get-Date -Day 1).ToString("yyyy-MM-dd")

# Datei vorbereiten (UTF-8)
Set-Content -Path $OutputFile -Value "Git Commit Report - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -Encoding UTF8
Add-Content -Path $OutputFile -Value "Autor: $author"
Add-Content -Path $OutputFile -Value "Branches: develop oder main"
Add-Content -Path $OutputFile -Value "Zeitraum: ab $startOfMonth"
Add-Content -Path $OutputFile -Value "============================================================="

# Alle Git-Repos finden
$repos = Get-ChildItem -Path $BaseDir -Directory -Recurse -ErrorAction SilentlyContinue |
    Where-Object { Test-Path "$($_.FullName)\.git" }

foreach ($repo in $repos) {
    $repoPath = $repo.FullName
    Add-Content -Path $OutputFile -Value ""
    Add-Content -Path $OutputFile -Value "Repository: $repoPath"
    Add-Content -Path $OutputFile -Value "---------------------------------------------"

    Push-Location $repoPath

    # Branch-Auswahl ohne Checkout: zuerst develop, dann main
    $branch = $null

    & git show-ref --verify --quiet refs/heads/develop
    if ($LASTEXITCODE -eq 0) {
        $branch = "develop"
    } else {
        & git show-ref --verify --quiet refs/heads/main
        if ($LASTEXITCODE -eq 0) {
            $branch = "main"
        }
    }

    if (-not $branch) {
        Add-Content -Path $OutputFile -Value "Kein develop oder main Branch gefunden. Uebersprungen."
        Pop-Location
        continue
    }

    # Commits fuer den Monat holen (nur eigener Author)
    $log = git log $branch --author="$author" --since="$startOfMonth" --pretty=format:"%ad | %s" --date=format:"%Y-%m-%d %H:%M:%S"

    if ($log) {
        Add-Content -Path $OutputFile -Value "Branch: $branch"
        $log | Out-File -FilePath $OutputFile -Append -Encoding UTF8
    } else {
        Add-Content -Path $OutputFile -Value "Keine Commits in diesem Monat auf Branch $branch."
    }

    Pop-Location
}

Add-Content -Path $OutputFile -Value ""
Add-Content -Path $OutputFile -Value "Report gespeichert unter: $OutputFile"
Write-Host "Report erstellt: $OutputFile"
