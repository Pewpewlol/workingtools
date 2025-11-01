import { test } from '@playwright/test';
import { FileChecker } from '../src/interfaces/out/file/file';
import { EmailService } from '../src/interfaces/out/email/emailService';
import { urbanErrorMailOptions } from '../src/interfaces/out/email/mailOptionsTemplate/urbanRechnungError';
import { urbanRechnungMailOptions } from '../src/interfaces/out/email/mailOptionsTemplate/urbanRechnungTemplate';

/**
 * Hilfsfunktion: Warten für eine bestimmte Zeit in Millisekunden
 * @param ms Wartezeit in Millisekunden
 */
function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generiert einen Datumsstring im Format MM_YYYY für Dateinamen
 * @returns String im Format "MM_YYYY" (z.B. "11_2024")
 */
function getDateString(): String {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 da getMonth() 0-basiert ist
  const year = now.getFullYear();
  const dateString = `${month}_${year}`;
  return dateString;
}

/**
 * Haupt-Test: Automatischer Download der Urban Sports Club Rechnung
 * 
 * Funktionen:
 * - Öffnet urbansportsclub.com
 * - Meldet sich automatisch an
 * - Navigiert zur Rechnungsübersicht
 * - Lädt die neueste Rechnung herunter
 * - Versendet Rechnung per Email
 * - Sendet Fehler-Email bei Problemen
 */
test('Urban Rechnungen', async ({ page }) => {

  const emailService = new EmailService();
  const recipientEmail = process.env.RECIPIENT_EMAIL;
  let currentStep = '';

  try {
    // SCHRITT 1: Urban Sports Club Website öffnen
    currentStep = 'Website öffnen';
    console.log(`Schritt: ${currentStep}`);
    await page.goto('https://urbansportsclub.com/de/', { timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // SCHRITT 2: Cookie-Banner akzeptieren (falls vorhanden)
    currentStep = 'Cookies akzeptieren';
    console.log(`Schritt: ${currentStep}`);
    const cookieButton = page.getByRole('button', { name: 'Alle Cookies akzeptieren' });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
    await page.waitForTimeout(1000);

    // SCHRITT 3: Zum Login-Bereich navigieren
    currentStep = 'Anmelde-Link klicken';
    console.log(`Schritt: ${currentStep}`);
    const anmeldeLink = page.getByRole('link', { name: 'Anmelden' });
    if (!(await anmeldeLink.isVisible())) {
      throw new Error('Anmelde-Link nicht gefunden oder nicht sichtbar');
    }
    await anmeldeLink.click();
    await page.waitForTimeout(3000);
    
    // SCHRITT 4: Login-Credentials aus Umgebungsvariablen laden und eingeben
    currentStep = 'Login-Daten eingeben';
    console.log(`Schritt: ${currentStep}`);
    const loginEmail = process.env.LOGIN_EMAIL || '';
    const loginPassword = process.env.LOGIN_PASSWORD || '';
    
    if (!loginEmail || !loginPassword) {
      throw new Error('Login-Daten nicht in Umgebungsvariablen gefunden (LOGIN_EMAIL, LOGIN_PASSWORD)');
    }
    
    const emailField = page.getByPlaceholder('E-Mail *');
    const passwordField = page.getByRole('textbox', { name: 'Passwort' });
    
    if (!(await emailField.isVisible()) || !(await passwordField.isVisible())) {
      throw new Error('Login-Felder nicht gefunden');
    }
    
    await emailField.fill(loginEmail);
    await passwordField.fill(loginPassword);
    
    // SCHRITT 5: Anmeldung durchführen
    currentStep = 'Anmeldung durchführen';
    console.log(`Schritt: ${currentStep}`);
    const anmeldeButton = page.getByRole('button', { name: 'Anmelden' });
    if (!(await anmeldeButton.isVisible()) || !(await anmeldeButton.isEnabled())) {
      throw new Error('Anmelde-Button nicht gefunden oder nicht klickbar');
    }
    await anmeldeButton.click();
    await page.waitForTimeout(5000);
    
    // SCHRITT 6: Anmeldung validieren (prüfen ob Login erfolgreich)
    currentStep = 'Anmeldung überprüfen';
    console.log(`Schritt: ${currentStep}`);
    const anmeldeUeberpruefungButton = page.getByRole('button', { name: 'Anmelden' });
    if ((await anmeldeUeberpruefungButton.isVisible()) || (await anmeldeUeberpruefungButton.isEnabled())) {
      throw new Error('Anmeldung fehlgeschlagen - Anmelde-Button immer noch sichtbar');
    }
    
    // SCHRITT 7: Zur Rechnungsübersicht navigieren
    currentStep = 'Rechnungsübersicht öffnen';
    console.log(`Schritt: ${currentStep}`);
    await page.goto('https://urbansportsclub.com/de/profile/payment-history', { timeout: 5000 });
    
    // SCHRITT 8: Download der neuesten Rechnung initialisieren
    currentStep = 'Rechnung herunterladen';
    console.log(`Schritt: ${currentStep}`);
    const downloadLink = page.getByRole('link', { name: 'Rechnung herunterladen' }).first();
    if (!(await downloadLink.isVisible())) {
      throw new Error('Download-Link für Rechnung nicht gefunden');
    }
    
    // Events für Popup und Download registrieren
    const page1Promise = page.waitForEvent('popup');
    const downloadPromise = page.waitForEvent('download');
    await downloadLink.click();
    await page1Promise;
    const download = await downloadPromise;
    
    // SCHRITT 9: Rechnung mit Datumsformat speichern
    currentStep = 'Datei speichern';
    console.log(`Schritt: ${currentStep}`);
    const fileName = `./urbanrechnung/Rechnung_${getDateString()}.pdf`;
    await download.saveAs(fileName);
    await wait(3000);
    
    // SCHRITT 10: Download-Erfolg validieren
    currentStep = 'Datei-Existenz prüfen';
    console.log(`Schritt: ${currentStep}`);
    const fileExists = FileChecker.doesFileExist(fileName);
    console.log(`Rechnung heruntergeladen: ${fileExists}`);
    
    if (!fileExists) {
      throw new Error(`Rechnung wurde nicht erfolgreich gespeichert: ${fileName}`);
    }
    
    // SCHRITT 11: Email-Versendung der Rechnung
    currentStep = 'Email versenden';
    console.log(`Schritt: ${currentStep}`);
    if (process.env.EMAIL_USER && recipientEmail) {
      console.log('Sende Rechnung per Email...');
      const emailSent = await emailService.sendEmail(fileName, urbanRechnungMailOptions(recipientEmail, fileName, `Rechnung_${getDateString()}.pdf`));
      if (!emailSent) {
        throw new Error('Email konnte nicht gesendet werden');
      }
      console.log(`Email erfolgreich gesendet: ${emailSent}`);
    } else {
      console.log('Email wird übersprungen - keine Email-Konfiguration vorhanden');
    }
    
    console.log('✅ Alle Schritte erfolgreich abgeschlossen!');
    
  } catch (error) {
    // FEHLERBEHANDLUNG: Detaillierte Fehleranalyse und Benachrichtigung
    const errorMessage = `Fehler in Schritt "${currentStep}": ${error instanceof Error ? error.message : String(error)}\n\nFull Error: ${error instanceof Error ? error.stack : String(error)}`;
    console.error(errorMessage);
    
    // Automatische Fehler-Email senden (falls Email konfiguriert ist)
    if (process.env.EMAIL_USER && recipientEmail) {
      console.log('Sende Fehler-Email...');
      try {
        await emailService.sendFehlerEmail(urbanErrorMailOptions(errorMessage, recipientEmail));
        console.log('Fehler-Email erfolgreich gesendet');
      } catch (emailError) {
        console.error('Fehler beim Senden der Fehler-Email:', emailError);
      }
    }
    
    // Test als fehlgeschlagen markieren (für GitHub Actions/CI)
    throw error;
  }
});
