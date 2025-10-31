import { test } from '@playwright/test';
import { FileChecker } from '../src/file/file';
import { EmailService } from '../src/email/emailService';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Aktuelles Datum für Dateinamen generieren
function getDateString(): String {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 weil getMonth() 0-basiert ist
  const year = now.getFullYear();
  const dateString = `${month}_${year}`;
  return dateString;
}

test('Urban Rechnungen', async ({ page }) => {

  await page.goto('https://urbansportsclub.com/de/');
  await page.waitForTimeout(3000);
  const cookieButton = page.getByRole('button', { name: 'Alle Cookies akzeptieren' });
  if (await cookieButton.isVisible()) {
        await cookieButton.click();
  }
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Anmelden' }).click();
  await page.waitForTimeout(3000);
  // Login-Daten aus Umgebungsvariablen oder Fallback
  const loginEmail = process.env.LOGIN_EMAIL || 'sandip.nijjar17@gmail.com';
  const loginPassword = process.env.LOGIN_PASSWORD || 'Fischfutter44.';
  
  await page.getByPlaceholder('E-Mail *').fill(loginEmail);
  await page.getByRole('textbox', { name: 'Passwort' }).fill(loginPassword);
  
  const anmeldeButton = page.getByRole('button', { name: 'Anmelden' });
  if (await anmeldeButton.isVisible() && await anmeldeButton.isEnabled()) {
    await anmeldeButton.click();
  }
  await page.waitForTimeout(5000);
  await page.goto('https://urbansportsclub.com/de/profile/payment-history');
  
  
  const page1Promise = page.waitForEvent('popup');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Rechnung herunterladen' }).first().click();
  const page1 = await page1Promise;
  await page1.pause();
  const download = await downloadPromise;
  
  // Dateiname mit Datum: z.B. "Rechnung_11_2024.pdf"
  const fileName = `./urbanrechnung/Rechnung_${getDateString()}.pdf`;
  await download.saveAs(fileName);
  await wait(3000);
  
  // Prüfen ob Datei erfolgreich heruntergeladen wurde
  const fileExists = FileChecker.doesFileExist(fileName);
  console.log(`Rechnung heruntergeladen: ${fileExists}`);
  
  // Email senden (nur wenn Datei existiert und Email-Konfiguration vorhanden)
  if (fileExists && process.env.EMAIL_USER && process.env.RECIPIENT_EMAIL) {
    const emailService = new EmailService();
    const recipientEmail = process.env.RECIPIENT_EMAIL;
    
    console.log('Sende Rechnung per Email...');
    const emailSent = await emailService.sendRechnungEmail(fileName, recipientEmail);
    console.log(`Email gesendet: ${emailSent}`);
  } else {
    console.log('Email wird übersprungen - keine Konfiguration oder Datei nicht vorhanden');
  }

});
