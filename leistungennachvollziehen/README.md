# Git Commit Report Generator

Dieses Tool generiert automatisch einen Bericht über alle Git-Commits des aktuellen Monats für einen bestimmten Autor. Es durchsucht rekursiv alle Git-Repositories in einem Verzeichnis und sammelt Commit-Informationen von den `develop` oder `main` Branches.

## 📋 Übersicht

Das Tool ist in zwei Versionen verfügbar:
- **`ErstelleCommitReport.bash`** - Bash-Script für macOS/Linux
- **`ErstelleCommitReport.ps1`** - PowerShell-Script für Windows

Beide Versionen erzeugen identische Ausgaben und durchsuchen automatisch:
- Alle Git-Repositories im angegebenen Verzeichnis (rekursiv)
- Commits des aktuellen Monats (ab dem 1. des Monats)
- Nur Commits des konfigurierten Git-Autors
- Bevorzugt `develop` Branch, falls nicht vorhanden dann `main`

## 📂 Ausgabe-Format

Der generierte Report enthält:
```
Git Commit Report - 2025-10-31 14:30:15
Autor: Sandip Nijjar
Branches: develop oder main
Zeitraum: ab 2025-10-01
=============================================================

Repository: /Users/sandipnijjar/projects/WorkRelated/crawler
---------------------------------------------
Branch: main
2025-10-31 14:25:30 | Add automated Urban Sports Club invoice pipeline
2025-10-31 12:15:45 | Fix nodemailer import in EmailService
2025-10-30 09:30:22 | Add email notification for playwright errors

Repository: /Users/sandipnijjar/projects/WorkRelated/textwriter
---------------------------------------------
Keine Commits in diesem Monat auf Branch main.

Report gespeichert unter: /Users/sandipnijjar/monthly_commits.txt
```

---

## 🐧 Bash-Version (macOS/Linux)

### Voraussetzungen
- Git muss installiert sein
- Bash (standardmäßig auf macOS/Linux verfügbar)
- Git-Konfiguration: `git config user.name` muss gesetzt sein

### Installation & Ausführung

1. **Script ausführbar machen:**
   ```bash
   chmod +x ErstelleCommitReport.bash
   ```

2. **Standard-Ausführung (aktuelles Verzeichnis):**
   ```bash
   ./ErstelleCommitReport.bash
   ```
   - Durchsucht das aktuelle Verzeichnis rekursiv
   - Speichert Report unter `~/monthly_commits.txt`

3. **Mit benutzerdefinierten Parametern:**
   ```bash
   ./ErstelleCommitReport.bash "/Users/sandipnijjar/projects" "/Users/sandipnijjar/Desktop/mein_report.txt"
   ```

### Parameter
- **Parameter 1 (optional):** Basis-Verzeichnis zum Durchsuchen (Standard: aktuelles Verzeichnis)
- **Parameter 2 (optional):** Ausgabe-Datei (Standard: `~/monthly_commits.txt`)

### Beispiele
```bash
# Alle Projekte im Home-Verzeichnis durchsuchen
./ErstelleCommitReport.bash "$HOME"

# Spezifisches Verzeichnis mit benutzerdefinierter Ausgabe
./ErstelleCommitReport.bash "/Users/sandipnijjar/projects" "/Users/sandipnijjar/Desktop/oktober_commits.txt"

# Mit relativem Pfad
./ErstelleCommitReport.bash "../alle_projekte" "./commits_report.txt"
```

---

## 🪟 PowerShell-Version (Windows)

### Voraussetzungen
- Git muss installiert sein
- PowerShell 5.1+ oder PowerShell Core
- Git-Konfiguration: `git config user.name` muss gesetzt sein

### Installation & Ausführung

1. **Execution Policy setzen (falls nötig):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Standard-Ausführung (aktuelles Verzeichnis):**
   ```powershell
   .\ErstelleCommitReport.ps1
   ```
   - Durchsucht das aktuelle Verzeichnis rekursiv
   - Speichert Report unter `$HOME\monthly_commits.txt`

3. **Mit benutzerdefinierten Parametern:**
   ```powershell
   .\ErstelleCommitReport.ps1 -BaseDir "C:\Users\Sandip\Projects" -OutputFile "C:\Users\Sandip\Desktop\mein_report.txt"
   ```

### Parameter
- **`-BaseDir` (optional):** Basis-Verzeichnis zum Durchsuchen (Standard: aktuelles Verzeichnis)
- **`-OutputFile` (optional):** Ausgabe-Datei (Standard: `$HOME\monthly_commits.txt`)

### Beispiele
```powershell
# Alle Projekte im Benutzer-Verzeichnis durchsuchen
.\ErstelleCommitReport.ps1 -BaseDir "$HOME"

# Spezifisches Verzeichnis mit benutzerdefinierter Ausgabe
.\ErstelleCommitReport.ps1 -BaseDir "C:\Projects" -OutputFile "C:\Reports\oktober_commits.txt"

# Nur BaseDir angeben (OutputFile bleibt Standard)
.\ErstelleCommitReport.ps1 -BaseDir "D:\Entwicklung"
```

---

## 🔧 Konfiguration

### Git-Autor konfigurieren
Falls noch nicht geschehen, Git-Autor setzen:
```bash
git config --global user.name "Ihr Name"
git config --global user.email "ihre.email@example.com"
```

### Branch-Priorität
Das Tool sucht in folgender Reihenfolge nach Branches:
1. **`develop`** (bevorzugt)
2. **`main`** (Fallback)
3. Überspringt Repository, falls keiner vorhanden

---

## 📅 Zeitraum-Logik

- **Automatisch:** Aktueller Monat (vom 1. bis heute)
- **Beispiel:** Am 31. Oktober 2025 werden alle Commits ab 1. Oktober 2025 erfasst
- **Keine Konfiguration nötig:** Das Script erkennt automatisch den aktuellen Monat

---

## 🚀 Verwendungszwecke

Dieses Tool ist ideal für:
- **Monatsberichte** für Arbeitgeber oder Kunden
- **Leistungsnachweis** für Freelancer/Consultants
- **Projektdokumentation** und Progress-Tracking
- **Code-Review Vorbereitung**
- **Zeiterfassung** basierend auf Git-Aktivitäten

---

## 🛠️ Troubleshooting

### Häufige Probleme

**"Git nicht gefunden"**
```bash
# macOS mit Homebrew
brew install git

# Ubuntu/Debian
sudo apt-get install git
```

**"Permission denied" (Bash)**
```bash
chmod +x ErstelleCommitReport.bash
```

**"Execution Policy" Fehler (PowerShell)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**"Kein Author konfiguriert"**
```bash
git config --global user.name "Ihr Name"
```

**"Keine Repositories gefunden"**
- Prüfen Sie, ob der angegebene Pfad korrekt ist
- Stellen Sie sicher, dass die Verzeichnisse `.git` Ordner enthalten
- Verwenden Sie absolute Pfade für mehr Klarheit

### Debug-Informationen
Für detailliertere Ausgabe während der Ausführung können Sie die Scripts anpassen oder die Ausgabe umleiten:

**Bash:**
```bash
bash -x ErstelleCommitReport.bash  # Debug-Modus
```

**PowerShell:**
```powershell
.\ErstelleCommitReport.ps1 -Verbose  # Falls Verbose-Parameter hinzugefügt wird
```

---

## 📝 Lizenz

Diese Scripts sind frei verwendbar für private und kommerzielle Zwecke.