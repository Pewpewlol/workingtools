# 📋 Leistungsnachweis Erstellen - Prozess Übersicht

Automatisierte Erstellung von Leistungsnachweisen aus Git-Commits mit ChatGPT-Analyse und Email-Versand.

## 🔄 Gesamtprozess

```
1. Git Commits sammeln → 2. ChatGPT Analyse → 3. Email-Versand → 4. Speicherung
```

## � Projektstruktur

```
crawler/
├── ressources/monthly_commits.txt    # Input: Git-Commit-Daten
├── commit_summary.txt               # Output: Generierte Zusammenfassung
├── src/
│   ├── domain/Aggregates/LeistungsnachweisErstellenAggregate.ts
│   ├── application/Leistungsnachweis/LeistungsnachweisErstellenUseCase.ts
│   └── interfaces/in/scripts/Leistungsnachweis/starteLeistungsnachweisErstellen.ts
└── .env.local                      # Lokale Umgebungsvariablen
```

## � Ausführungsmöglichkeiten

### Lokal
```bash
npm run leistungsnachweis:local    # Mit .env.local
npm run leistungsnachweis:ci       # Ohne Umgebungsvariablen
```

### GitHub Actions
- **Automatisch**: Bei Push auf `crawler/ressources/monthly_commits.txt`
- **Manuell**: Actions → "Leistungsnachweis Erstellen" → Run workflow

## � Input-Format

**Datei**: `ressources/monthly_commits.txt`
```
2025-11-01 | workingtools | main | feat: Add new feature
2025-11-02 | projectname | develop | fix: Bug correction
```
**Format**: `Datum | Repository | Branch | Commit-Message`

## 🤖 Verarbeitung

1. **Datei einlesen** (`monthly_commits.txt`)
2. **ChatGPT-Analyse** mit OpenAI API
3. **Strukturierung** nach Datum/Repository
4. **Zusammenfassung** generieren
5. **Speicherung** als `commit_summary.txt`

## 📧 Email-Versand

- **Empfänger**: Konfigurierte Email-Adresse
- **Anhang**: `commit_summary.txt`
- **Service**: Gmail mit App-Passwort
- **Fehlerbehandlung**: Automatische Fehler-Emails

## ⚙️ Konfiguration

### Umgebungsvariablen
```bash
OPENAI_API_KEY=sk-...              # ChatGPT API
EMAIL_USER=your.email@gmail.com    # Gmail-Adresse  
EMAIL_PASSWORD=app_password        # Gmail App-Passwort
RECIPIENT_EMAIL=recipient@company.com
```

### GitHub Secrets
Repository Settings → Secrets and variables → Actions
- Gleiche Variablen wie oben für automatische Ausführung

## 🧪 Tests

```bash
npm run ittests:local    # Email-Service Integration Test
```

## � Output-Beispiel

```
Leistungsnachweis November 2025
==============================

01.11.2025 | workingtools | main
  - feat: Add new feature
  - fix: Bug correction

ChatGPT Zusammenfassung:
[Intelligente Analyse der Arbeitsaktivitäten...]
```

## 🔧 Häufige Probleme

| Problem | Lösung |
|---------|--------|
| Email nicht erhalten | Gmail App-Passwort erstellen |
| ChatGPT Fehler | OpenAI API-Key prüfen |
| Datei nicht gefunden | `monthly_commits.txt` Pfad checken |

---

**Workflow**: Commits sammeln → ChatGPT verarbeiten → Email senden → Done! ✅