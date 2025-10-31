# GitHub Secrets Konfiguration

Für die automatische Ausführung der Urban Rechnung Pipeline müssen Sie folgende Secrets in Ihrem GitHub Repository einrichten:

## Secrets einrichten

Gehen Sie zu Ihrem GitHub Repository → Settings → Secrets and Variables → Actions → New repository secret

### Erforderliche Secrets:

1. **EMAIL_USER**
   - Ihre Gmail-Adresse (z.B. `sandip.nijjar17@gmail.com`)
   - Wird verwendet, um die Email zu versenden

2. **EMAIL_PASSWORD**
   - Ihr Gmail App-Passwort (NICHT Ihr normales Passwort!)
   - Erstellen Sie ein App-Passwort: https://support.google.com/accounts/answer/185833
   - Aktivieren Sie 2FA in Google und erstellen Sie dann ein App-Passwort

3. **RECIPIENT_EMAIL**
   - Die Email-Adresse, an die die Rechnung gesendet werden soll
   - Kann die gleiche wie EMAIL_USER sein

4. **LOGIN_EMAIL**
   - Ihre Urban Sports Club Email-Adresse
   - Standardwert: `sandip.nijjar17@gmail.com`

5. **LOGIN_PASSWORD**
   - Ihr Urban Sports Club Passwort
   - Standardwert: `Fischfutter44.`

## Gmail App-Passwort erstellen

1. Gehen Sie zu Ihrem Google-Konto
2. Aktivieren Sie die 2-Faktor-Authentifizierung
3. Gehen Sie zu "App-Passwörter"
4. Wählen Sie "Mail" und "Anderes Gerät"
5. Geben Sie "GitHub Actions" als Namen ein
6. Kopieren Sie das generierte Passwort und verwenden Sie es als EMAIL_PASSWORD

## Pipeline Zeitplan

Die Pipeline läuft automatisch:
- **Jeden 15. des Monats um 11:00 CET (9:00 UTC)**
- Kann auch manuell über GitHub Actions ausgeführt werden

## Funktionsweise

1. GitHub Actions startet um den 15. des Monats
2. Playwright öffnet urbansportsclub.com
3. Loggt sich mit Ihren Credentials ein
4. Lädt die neueste Rechnung herunter
5. Benennt sie mit aktuellem Datum (z.B. `Rechnung_11_2024.pdf`)
6. Sendet die Rechnung per Email an die konfigurierte Adresse
7. Speichert die Rechnung als Artifact für 90 Tage

## Manueller Test

Sie können die Pipeline manuell testen:
1. Gehen Sie zu Actions in Ihrem Repository
2. Wählen Sie "Urban Rechnung Download & Email"
3. Klicken Sie auf "Run workflow"