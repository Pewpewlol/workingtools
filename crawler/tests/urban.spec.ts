import { test, expect } from '@playwright/test';
import { FileChecker } from '../src/file/file';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  await page.getByPlaceholder('E-Mail *').fill('sandip.nijjar17@gmail.com');
  await page.getByRole('textbox', { name: 'Passwort' }).fill('Fischfutter44.');
  
  const anmeldeButton = page.getByRole('button', { name: 'Anmelden' });
  if (await anmeldeButton.isVisible() && await anmeldeButton.isEnabled()) {
    await anmeldeButton.click();
  }
  await page.waitForTimeout(5000);
  await page.goto('https://urbansportsclub.com/de/profile/payment-history');
  // Aktuelles Datum für Dateinamen generieren
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 weil getMonth() 0-basiert ist
  const year = now.getFullYear();
  const dateString = `${month}_${year}`;
  
  const page1Promise = page.waitForEvent('popup');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Rechnung herunterladen' }).first().click();
  const page1 = await page1Promise;
  await page1.pause();
  const download = await downloadPromise;
  
  // Dateiname mit Datum: z.B. "Rechnung_11_2024.pdf"
  const fileName = `./urbanrechnung/Rechnung_${dateString}.pdf`;
  download.saveAs(fileName);
  await wait(3000);
  FileChecker.doesFileExist(fileName);

});
