# Lokale Ausführung - Setup Anleitung

## 1. Dependencies installieren

```bash
npm install
```

## 2. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local` Datei im `crawler/` Verzeichnis:
```bash
touch .env.local
```

**Gmail App-Passwort erstellen:**
- Gehen Sie zu https://myaccount.google.com/security
- Aktivieren Sie 2-Faktor-Authentifizierung
- Gehen Sie zu "App-Passwörter"
- Erstellen Sie ein neues App-Passwort für "Mail"
- Verwenden Sie dieses 16-stellige Passwort als `EMAIL_PASS`

## 3. Verfügbare Scripts

### Urban Sports Club (Rechnung herunterladen):
```bash
npm run urban:local      # Kopflos mit Email-Versendung
npm run urban:headed     # Mit Browser-Anzeige (Debugging)
npm run urban:headless   # Kopflos ohne Email
```

### Leistungsnachweis erstellen:
```bash
npm run leistungsnachweis:local    # Mit lokalen Umgebungsvariablen
npm run leistungsnachweis:ci       # Ohne dotenv (direkt)
```

### Tests:
```bash
npm run ittests:local             # Email-Service Integration Test
```

## 4. Umgebungsvariablen (.env.local)

Ihre `.env.local` Datei sollte diese Variablen enthalten:

```env
# Email-Konfiguration (Gmail)
EMAIL_USER=ihre-email@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop     # Gmail App-Passwort (16 Zeichen)
RECIPIENT_EMAIL=empfaenger@gmail.com

# Urban Sports Club Login
LOGIN_EMAIL=ihre-urban-email@gmail.com
LOGIN_PASSWORD=IhrUrbanPasswort

# ChatGPT/OpenAI API (für Leistungsnachweis)
OPENAI_API_KEY=sk-...

# Optional
DEBUG=true
```

**Wichtig:** Verwenden Sie `EMAIL_PASS` (nicht `EMAIL_PASSWORD`) für Gmail!

## 5. Testing & Debugging

### Email-Service testen:
```bash
npm run ittests:local    # Vollständiger Email-Integration-Test
```

### Einzelne Services debuggen:
```bash
# Playwright Browser öffnen (Visual Debugging)
npm run urban:headed

# Leistungsnachweis ohne Email testen
npm run leistungsnachweis:ci

# Umgebungsvariablen prüfen
echo $EMAIL_USER    # Sollte Ihre Email anzeigen
```

### Log-Ausgabe interpretieren:
- ✅ Erfolgreich: Grüne Checkmarks und "erfolgreich" Messages
- ❌ Fehler: Rote X-Marks mit Fehlerbeschreibung
- 📧 Email-Status: "Email erfolgreich gesendet" oder Fehler-Details

## 6. Projektstruktur (Überblick)

```
crawler/
├── .env.local                      # Ihre lokalen Umgebungsvariablen
├── ressources/monthly_commits.txt  # Input für Leistungsnachweis
├── commit_summary.txt             # Output von ChatGPT-Analyse
├── src/
│   ├── interfaces/in/scripts/Leistungsnachweis/
│   ├── domain/Aggregates/
│   └── application/Leistungsnachweis/
├── tests/
│   ├── urban.spec.ts              # Urban Sports Automation
│   └── integrationtest/           # Email-Service Tests
└── urbanrechnung/                 # Heruntergeladene Rechnungen
```

## 7. Sicherheit & Best Practices

- ⚠️ **`.env.local` NIEMALS in Git committen!** (ist bereits in .gitignore)
- Verwenden Sie **nur Gmail App-Passwörter**, nie Ihr echtes Passwort
- Testen Sie neue Änderungen erst lokal, bevor Sie pushen

## 8. Häufige Probleme & Lösungen

| Problem | Lösung |
|---------|--------|
| "Email nicht erhalten" | Gmail App-Passwort prüfen, 2FA aktivieren |
| "ChatGPT API Fehler" | OpenAI API-Key validieren |
| "monthly_commits.txt nicht gefunden" | Datei in `ressources/` erstellen |
| "Dependencies Fehler" | `npm install` erneut ausführen |
| "Urban Login fehlgeschlagen" | Login-Daten in .env.local prüfen |

## 9. Nächste Schritte

Nach dem lokalen Setup:
1. **Testen Sie alle Services**: `npm run ittests:local`
2. **Urban Automation**: `npm run urban:local`
3. **Leistungsnachweis**: `npm run leistungsnachweis:local`
4. **GitHub Actions**: Push triggert automatische Ausführung