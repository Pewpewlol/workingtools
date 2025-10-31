#!/usr/bin/env bash
set -euo pipefail

# Nutzung:
#   ./get-monthly-commits.sh [BASE_DIR] [OUTPUT_FILE]
# Beispiel:
#   ./get-monthly-commits.sh "$HOME/Projekte" "$HOME/monthly_commits.txt"

BASE_DIR="${1:-$PWD}"
OUTPUT_FILE="${2:-$HOME/monthly_commits.txt}"

AUTHOR="$(git config user.name || true)"
START_OF_MONTH="$(date +%Y-%m-01)"

# Header
{
  echo "Git Commit Report - $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Autor: ${AUTHOR}"
  echo "Branches: develop oder main"
  echo "Zeitraum: ab ${START_OF_MONTH}"
  echo "============================================================="
} > "$OUTPUT_FILE"

# Alle Git-Repos finden und durchlaufen
while IFS= read -r -d '' GITDIR; do
  REPO_DIR="${GITDIR%/.git}"

  {
    echo
    echo "Repository: ${REPO_DIR}"
    echo "---------------------------------------------"
  } >> "$OUTPUT_FILE"

  pushd "$REPO_DIR" >/dev/null

  BRANCH=""
  if git show-ref --verify --quiet refs/heads/develop; then
    BRANCH="develop"
  elif git show-ref --verify --quiet refs/heads/main; then
    BRANCH="main"
  else
    echo "Kein develop oder main Branch gefunden. Uebersprungen." >> "$OUTPUT_FILE"
    popd >/dev/null
    continue
  fi

  # Commits des Monats nur fuer den eigenen Author
  LOG_OUTPUT="$(git log "$BRANCH" --author="$AUTHOR" --since="$START_OF_MONTH" \
    --pretty=format:'%ad | %s' --date=format:'%Y-%m-%d %H:%M:%S' || true)"

  if [[ -n "${LOG_OUTPUT}" ]]; then
    echo "Branch: ${BRANCH}" >> "$OUTPUT_FILE"
    printf "%s\n" "${LOG_OUTPUT}" >> "$OUTPUT_FILE"
  else
    echo "Keine Commits in diesem Monat auf Branch ${BRANCH}." >> "$OUTPUT_FILE"
  fi

  popd >/dev/null
done < <(find "$BASE_DIR" -type d -name .git -print0 2>/dev/null)

{
  echo
  echo "Report gespeichert unter: ${OUTPUT_FILE}"
} >> "$OUTPUT_FILE"

echo "Report erstellt: ${OUTPUT_FILE}"
