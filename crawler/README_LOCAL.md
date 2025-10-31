# Lokale Ausführung - Setup Anleitung

## 1. Dependencies installieren

```bash
npm install
```

## 2. Umgebungsvariablen konfigurieren

1. Kopieren Sie die Beispiel-Datei:
   ```bash
   cp .env.local.example .env.local
   ```

2. Bearbeiten Sie `.env.local` und tragen Sie Ihre echten Daten ein:
   ```bash
   nano .env.local  # oder Ihr bevorzugter Editor
   ```

3. **Gmail App-Passwort erstellen:**
   - Gehen Sie zu https://myaccount.google.com/security
   - Aktivieren Sie 2-Faktor-Authentifizierung
   - Gehen Sie zu "App-Passwörter"
   - Erstellen Sie ein neues App-Passwort für "Mail"
   - Verwenden Sie dieses Passwort als `EMAIL_PASSWORD`

## 3. Lokale Ausführung

### Kopflos (headless) mit Email-Versendung:
```bash
npm run urban:local
```

### Mit Browser-Anzeige (für Debugging):
```bash
npm run urban
```

### Nur headless ohne Email:
```bash
npm run urban:headless
```

## 4. Umgebungsvariablen

Ihre `.env.local` Datei sollte so aussehen:

```env
# Email-Konfiguration
EMAIL_USER=ihre-email@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # Gmail App-Passwort
RECIPIENT_EMAIL=empfaenger@gmail.com

# Urban Sports Club Login
LOGIN_EMAIL=ihre-urban-email@gmail.com
LOGIN_PASSWORD=IhrUrbanPasswort

# Optional
DEBUG=true
```

## 5. Debugging

Falls Probleme auftreten:

1. **Email-Verbindung testen:**
   ```bash
   node -e "
   require('dotenv').config({path: '.env.local'});
   const {EmailService} = require('./src/email/emailService');
   const service = new EmailService();
   service.testConnection().then(result => console.log('Test:', result));
   "
   ```

2. **Playwright Browser öffnen:**
   ```bash
   npm run urban  # Mit --headed Flag
   ```

3. **Logs prüfen:**
   - Schauen Sie in die Konsole nach Fehlermeldungen
   - Prüfen Sie ob alle Umgebungsvariablen gesetzt sind

## 6. Sicherheit

- ⚠️ **Niemals** die `.env.local` Datei in Git committen!
- Die `.env.local` ist bereits in der `.gitignore` eingetragen
- Verwenden Sie nur App-Passwörter, nie Ihr echtes Gmail-Passwort

## 7. Troubleshooting

### "nodemailer not found"
```bash
npm install nodemailer @types/nodemailer
```

### "dotenv-cli not found"
```bash
npm install dotenv-cli
```

### "Gmail authentication failed"
- Prüfen Sie Ihr App-Passwort
- Aktivieren Sie 2-Faktor-Authentifizierung
- Stellen Sie sicher, dass "Less secure app access" deaktiviert ist

### "Urban Sports Club login failed"
- Prüfen Sie Ihre Login-Daten
- Möglicherweise hat sich die Website-Struktur geändert